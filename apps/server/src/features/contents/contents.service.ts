import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { CreateContentDto } from "./dto/create-content.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { Content } from "./entities/content.entity";
import { TagsService } from "../tags/tags.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService
  ) {}

  async create(authorId: number, createContentDto: CreateContentDto) {
    const {
      title,
      body,
      publish,
      private: isPrivate,
      tags: tagNames,
    } = createContentDto;

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

  async findManyPublicWithPagination(
    authorId: number,
    tagIds: number[],
    page: number,
    pageSize: number,
    total: number
  ) {
    if (!tagIds.length) {
      // If no tags, fall back to plain offset pagination quickly
      const qb = this.repo
        .createQueryBuilder("c")
        .where("c.author_id = :authorId", { authorId })
        .andWhere("c.publish = true")
        .andWhere("c.private = false")
        .orderBy("c.id", "DESC")
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .select([
          "c.id",
          "c.title",
          "c.created_at",
          "c.updated_at",
          "c.author_id",
        ]);

      const [items, total] = await Promise.all([qb.getMany(), qb.getCount()]);
      return {
        items,
        meta: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNext: page * pageSize < total,
        },
      };
    }

    // 1) Set of content.id satisfying tag AND (GROUP BY/HAVING)
    const base = this.repo
      .createQueryBuilder("c")
      .innerJoin("content_tag", "ct", "ct.content_id = c.id")
      .where("c.author_id = :authorId", { authorId })
      .andWhere("c.publish = true")
      .andWhere("c.private = false")
      .andWhere("ct.tag_id IN (:...tagIds)", { tagIds })
      .groupBy("c.id")
      .having("COUNT(DISTINCT ct.tag_id) = :need", { need: tagIds.length }); // AND

    // 2) Subquery to sort + OFFSET/LIMIT for pagination
    const idsSub = this.repo
      .createQueryBuilder()
      .select("b.id", "id")
      .from("(" + base.orderBy("c.id", "DESC").getQuery() + ")", "b")
      .setParameters(base.getParameters())
      .offset((page - 1) * pageSize) // OFFSET
      .limit(pageSize); // LIMIT

    // 3) Join to fetch actual content rows (single round-trip)
    const items = await this.repo
      .createQueryBuilder("content")
      .innerJoin("(" + idsSub.getQuery() + ")", "ids", "ids.id = content.id")
      .setParameters(idsSub.getParameters())
      .orderBy("content.id", "DESC")
      .select([
        "content.id",
        "content.title",
        "content.created_at",
        "content.updated_at",
        "content.author_id",
      ])
      .getMany();

    if (!total) {
      // 4) Total count (use a separate COUNT query only if you need exact value)
      const totalRow = await this.repo
        .createQueryBuilder()
        .select("COUNT(*)", "cnt")
        .from("(" + base.getQuery() + ")", "x")
        .setParameters(base.getParameters())
        .getRawOne<{ cnt: string }>();

      total = Number(totalRow?.cnt ?? 0);
    }

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
      },
    };
  }

  async findOneByIdWithPublic(id: number) {
    const content = await this.repo.findOne({
      where: { id, private: false, publish: true },
      relations: ["tags"],
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async update(
    id: number,
    updateContentDto: UpdateContentDto
  ): Promise<Content> {
    const { tags: tagNames, ...rest } = updateContentDto;

    const content = await this.repo.preload({
      id,
      ...rest,
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    if (tagNames) {
      content.tags = await this.tagsService.findAndCreateMany(tagNames);
    }

    return this.repo.save(content);
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }
}
