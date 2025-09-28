import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

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
    private readonly tagsService: TagsService,
    private readonly dataSource: DataSource
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
    sort: ESortType,
    owner: boolean
  ) {
    const order = this.getOrderType(sort);
    const op = this.getIdOpType(sort);

    const query = this.repo.createQueryBuilder("c").where("true");

    if (type) {
      query.andWhere("c.type = :type", { type });
    }

    if (offset !== undefined) {
      query.andWhere(`c.id ${op} :offset`, { offset });
    }

    if (!owner) {
      query.andWhere("c.publish = true").andWhere("c.private = false");
    }

    query
      .orderBy("c.id", order)
      .limit(limit + 1)
      .select([
        "c.id",
        "c.title",
        "c.type",
        "c.publish",
        "c.private",
        "c.createdAt",
        "c.updatedAt",
        "c.authorId",
      ]);

    const rows = await query.getMany();
    const hasNext = rows.length > limit;
    const contents = hasNext ? rows.slice(0, limit) : rows;
    const lastOffset = contents.at(-1)?.id ?? null;

    return { contents, lastOffset, hasNext };
  }

  async listQueryByTags(
    type: EContentType,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType,
    owner: boolean
  ) {
    const order = this.getOrderType(sort);
    const op = this.getIdOpType(sort);

    const query = this.repo
      .createQueryBuilder("c")
      .innerJoin("content_tag", "ct", "ct.content_id = c.id")
      .where("true");

    if (type) {
      query.andWhere("c.type = :type", { type });
    }

    if (offset !== undefined) {
      query.andWhere(`c.id ${op} :offset`, { offset });
    }

    if (!owner) {
      query.andWhere("c.publish = true").andWhere("c.private = false");
    }

    query
      .andWhere("ct.tag_id IN (:...tagIds)", { tagIds })
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
        "c.createdAt",
        "c.updatedAt",
        "c.authorId",
      ]);

    const rows = await query.getMany();
    const hasNext = rows.length > limit;
    const contents = hasNext ? rows.slice(0, limit) : rows;
    const lastOffset = contents.at(-1)?.id ?? null;

    return { contents, lastOffset, hasNext };
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

  async verify(id: number, authorId: number) {
    const exist = await this.repo.existsBy({ id, authorId });
    if (!exist) throw new NotFoundException("This content is not yours");
    return exist;
  }

  async list(
    type: EContentType,
    tagIds: number[],
    offset: number,
    limit: number,
    sort: ESortType,
    owner: boolean
  ) {
    const withTag = tagIds.length > 0;

    if (!withTag) return this.listQuery(type, offset, limit, sort, owner);
    return this.listQueryByTags(type, tagIds, offset, limit, sort, owner);
  }

  async detail(id: number, userId?: number, bypass?: boolean) {
    const content = await this.repo.findOne({
      where: { id },
      relations: ["tags"],
    });

    if (!content) throw new NotFoundException("Content not found");
    if (!content.publish || content.private) {
      if (!bypass && content.authorId !== userId)
        throw new ForbiddenException("Do not have access to the content");
    }

    return content;
  }

  async update(id: number, userId: number, data: UpdateContentDto) {
    const { tags: tagNames, ...rest } = data;

    const content = await this.repo.preload({ id, ...rest });

    if (!content) throw new NotFoundException("Content not found");
    if (content.authorId !== userId)
      throw new ForbiddenException("Do not have access to the content");

    if (tagNames) {
      content.tags = await this.tagsService.findAndCreateMany(tagNames);
    }

    return this.repo.save(content);
  }

  async delete(id: number, userId: number) {
    await this.dataSource.transaction(async (tm) => {
      const raw = await tm
        .createQueryBuilder()
        .select("c.authorId", "authorId")
        .from(Content, "c")
        .where("c.id = :id", { id })
        .getRawOne<{ authorId: number }>();

      if (!raw) throw new NotFoundException("Content not found");
      if (raw.authorId !== userId) {
        throw new ForbiddenException("Do not have access to the content");
      }

      await tm.createQueryBuilder().relation(Content, "tags").of(id).set([]);

      const result = await tm.delete(Content, { id });
      if (!result.affected) throw new NotFoundException("Content not found");
    });
  }
}
