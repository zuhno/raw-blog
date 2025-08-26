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
import { EContentType } from "../../shared/utils/type";

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
  getIdOpType(sort: ESortType) {
    return sort === ESortType.ASC ? ">" : "<";
  }

  async listQuery(
    type: EContentType,
    offset: number,
    limit: number,
    sort: ESortType
  ) {
    const order = this.getOrderType(sort);
    const op = this.getIdOpType(sort);

    const query = this.repo
      .createQueryBuilder("c")
      .where("c.type = :type", { type })
      .andWhere(`c.id ${op} :offset`, { offset })
      .andWhere("c.publish = true")
      .orderBy("c.id", order)
      .limit(limit + 1)
      .select([
        "c.id",
        "c.title",
        "c.type",
        "c.publish",
        "c.private",
        "c.created_at",
        "c.updated_at",
        "c.author_id",
      ]);

    const rows = await query.getMany();
    const hasNext = rows.length > limit;
    const contents = hasNext ? rows.slice(0, limit) : rows;
    const nextOffset = contents.at(-1)?.id ?? null;

    return { contents, nextOffset, hasNext };
  }

  async listQueryByTags(
    type: EContentType,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType
  ) {
    const order = this.getOrderType(sort);
    const op = this.getIdOpType(sort);

    const query = this.repo
      .createQueryBuilder("c")
      .innerJoin("content_tag", "ct", "ct.content_id = c.id")
      .where("c.type = :type", { type })
      .andWhere("ct.tag_id IN (:...tagIds)", { tagIds })
      .andWhere(`c.id ${op} :offset`, { offset })
      .andWhere("c.publish = true")
      .groupBy("c.id")
      .having("COUNT(DISTINCT ct.tag_id) = :need", { need: tagIds.length })
      .orderBy("c.id", order)
      .limit(limit + 1)
      .select([
        "c.id",
        "c.title",
        "c.type",
        "c.publish",
        "c.private",
        "c.created_at",
        "c.updated_at",
        "c.author_id",
      ]);

    const rows = await query.getMany();
    const hasNext = rows.length > limit;
    const contents = hasNext ? rows.slice(0, limit) : rows;
    const nextOffset = contents.at(-1)?.id ?? null;

    return { contents, nextOffset, hasNext };
  }

  async create(authorId: number, data: CreateContentDto) {
    const {
      title,
      body,
      type,
      publish,
      private: isPrivate,
      tags: tagNames,
    } = data;

    const user = await this.usersService.findById(authorId);
    if (!user) throw new NotFoundException("User not found");

    const tags = await this.tagsService.findAndCreateMany(tagNames);

    const content = this.repo.create({
      title,
      body,
      type,
      publish,
      private: isPrivate,
      author: user,
      tags,
    });

    return this.repo.save(content);
  }

  async list(
    type: EContentType,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType
  ) {
    const withTag = tagIds.length >= 0;

    if (!withTag) return this.listQuery(type, offset, limit, sort);
    return this.listQueryByTags(type, tagIds, offset, limit, sort);
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
