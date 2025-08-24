import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { CreateContentDto } from "./dto/create-content.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { Content } from "./entities/content.entity";
import { TagsService } from "../tags/tags.service";
import { UsersService } from "../users/users.service";
import { ESortType } from "./dto/content-list.dto";

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService
  ) {}

  getOrderType(sort: ESortType) {
    return sort === ESortType.DESC ? "DESC" : "ASC";
  }

  async listQuery(
    authorId: number,
    offset: number,
    limit: number,
    sort: ESortType,
    isMine: boolean
  ) {
    const query = this.repo
      .createQueryBuilder("c")
      .where("c.author_id = :authorId", { authorId })
      .where("c.id > :offset", { offset });

    if (!isMine) {
      query.andWhere("c.publish = true").andWhere("c.private = false");
    }

    query
      .orderBy("c.id", this.getOrderType(sort))
      .limit(limit)
      .select([
        "c.id",
        "c.title",
        "c.publish",
        "c.private",
        "c.created_at",
        "c.updated_at",
        "c.author_id",
      ]);

    const contents = await query.getMany();
    const nextOffset = contents.at(-1)?.id ?? null;
    const hasNext = contents.length === limit;

    return { contents, nextOffset, hasNext };
  }

  async listQueryByTags(
    authorId: number,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType,
    isMine: boolean
  ) {
    const query = this.repo
      .createQueryBuilder("c")
      .innerJoin("content_tag", "ct", "ct.content_id = c.id")
      .where("c.author_id = :authorId", { authorId });

    if (!isMine) {
      query.andWhere("c.publish = true").andWhere("c.private = false");
    }

    query
      .andWhere("ct.tag_id IN (:...tagIds)", { tagIds })
      .where("c.id > :offset", { offset })
      .groupBy("c.id")
      .having("COUNT(DISTINCT ct.tag_id) = :need", { need: tagIds.length })
      .orderBy("c.id", this.getOrderType(sort))
      .limit(limit)
      .select([
        "c.id",
        "c.title",
        "c.publish",
        "c.private",
        "c.created_at",
        "c.updated_at",
        "c.author_id",
      ]);

    const contents = await query.getMany();
    const nextOffset = contents.at(-1)?.id ?? null;
    const hasNext = contents.length === limit;

    return { contents, nextOffset, hasNext };
  }

  async create(authorId: number, data: CreateContentDto) {
    const { title, body, publish, private: isPrivate, tags: tagNames } = data;

    const user = await this.usersService.findById(authorId);
    if (!user) throw new NotFoundException("User not found");

    const tags = await this.tagsService.findAndCreateMany(tagNames);

    const content = this.repo.create({
      title,
      body,
      publish,
      private: isPrivate,
      author: user,
      tags,
    });

    return this.repo.save(content);
  }

  async list(
    authorId: number,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType,
    isMine: boolean
  ) {
    const withTag = tagIds.length >= 0;

    if (!withTag) return this.listQuery(authorId, offset, limit, sort, isMine);
    return this.listQueryByTags(authorId, tagIds, offset, limit, sort, isMine);
  }

  async detail(id: number, userId?: number, bypass?: boolean) {
    const content = await this.repo.findOne({
      where: { id },
      relations: ["tags"],
    });

    if (!content) throw new NotFoundException("Content not found");
    if (!content.publish || content.private) {
      if (!bypass && content.authorId !== userId)
        throw new UnauthorizedException("Do not have access to the content");
    }

    return content;
  }

  async update(
    id: number,
    userId: number,
    data: UpdateContentDto
  ): Promise<Content> {
    const { tags: tagNames, ...rest } = data;

    const content = await this.repo.preload({ id, ...rest });

    if (!content) throw new NotFoundException(`Content not found`);
    if (content.authorId !== userId)
      throw new UnauthorizedException("Do not have access to the content");

    if (tagNames) {
      content.tags = await this.tagsService.findAndCreateMany(tagNames);
    }

    return this.repo.save(content);
  }
}
