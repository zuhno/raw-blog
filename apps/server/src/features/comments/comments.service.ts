import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { CreateCommentDto } from "./dto/create-comment.dto";
import type { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import type { Nullable } from "../../shared/utils/type";
import { ContentsService } from "../contents/contents.service";
import { UsersService } from "../users/users.service";
import { TCommentNode } from "./dto/comment-list.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly contentsService: ContentsService
  ) {}

  async create(authorId: number, data: CreateCommentDto) {
    const { contentId, parentId, text } = data;

    const user = await this.usersService.findById(authorId);
    if (!user) throw new NotFoundException("User not found");

    const content = await this.contentsService.detail(
      contentId,
      undefined,
      true
    );
    if (!content) throw new NotFoundException("Content not found");
    if (!content.publish || content.private)
      throw new ForbiddenException("Do not have access to the content");

    let parent: Nullable<Comment> = null;
    if (parentId) {
      parent = await this.repo.findOne({ where: { id: parentId } });
      if (!parent) throw new NotFoundException("Parent comment not found");
    }

    const comment = this.repo.create({
      text,
      author: user,
      content,
      ...(parent && { parent }),
    });

    return this.repo.save(comment);
  }

  async list(contentId: number) {
    const rows = await this.repo
      .createQueryBuilder("c")
      .leftJoin("c.author", "a")
      .where("c.content_id = :contentId", { contentId })
      .orderBy("c.id", "DESC")
      .select([
        "c.id",
        "c.text",
        "c.createdAt",
        "c.updatedAt",
        "c.parent",
        "c.author",
        "a.id",
        "a.nickname",
        "a.avatarUrl",
      ])
      .getMany();

    const byId = new Map<number, TCommentNode>();
    const roots: TCommentNode[] = [];

    for (const r of rows) {
      byId.set(r.id, {
        id: r.id,
        text: r.text,
        authorId: r.authorId,
        contentId: r.contentId,
        parentId: r.parentId ?? r.parent?.id ?? null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        author: {
          id: r.author?.id,
          nickname: r.author?.nickname,
          avatarUrl: r.author?.avatarUrl,
        },
        children: [],
      });
    }

    for (const node of byId.values()) {
      if (node.parentId && byId.has(node.parentId)) {
        byId.get(node.parentId)!.children.push(node);
      } else {
        node.parentId = null;
        roots.push(node);
      }
    }

    return roots;
  }

  async update(id: number, userId: number, data: UpdateCommentDto) {
    const comment = await this.repo.preload({ id, ...data });

    if (!comment) throw new NotFoundException("Comment not found");
    if (comment.authorId !== userId) {
      throw new ForbiddenException("Do not have access to the comment");
    }

    return this.repo.save(comment);
  }

  async remove(id: number, userId: number) {
    const comment = await this.repo.findOne({ where: { id } });

    if (!comment) throw new NotFoundException("Comment not found");
    if (comment.authorId !== userId) {
      throw new ForbiddenException("Do not have access to the comment");
    }

    await this.repo.remove(comment);
  }
}
