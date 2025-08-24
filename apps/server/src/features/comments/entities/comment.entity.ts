import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from "typeorm";

import { User } from "../../../features/users/entities/user.entity";
import { Content } from "../../contents/entities/content.entity";

@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @RelationId((comment: Comment) => comment.author)
  authorId!: number;

  @RelationId((comment: Comment) => comment.content)
  contentId!: number;

  @RelationId((comment: Comment) => comment.parent)
  parentId?: number;

  @Column({ type: "text" })
  text!: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  author!: User;

  @ManyToOne(() => Content, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn({ name: "content_id", referencedColumnName: "id" })
  content!: Content;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    cascade: false,
  })
  @JoinColumn({ name: "parent_id", referencedColumnName: "id" })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children?: Comment[];
}
