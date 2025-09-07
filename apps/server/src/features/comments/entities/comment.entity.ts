import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { User } from "../../../features/users/entities/user.entity";
import { Content } from "../../contents/entities/content.entity";

@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ name: "author_id" })
  authorId!: number;

  @Column({ name: "content_id" })
  contentId!: number;

  @Column({ name: "parent_id", nullable: true })
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
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "content_id", referencedColumnName: "id" })
  content!: Content;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    cascade: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_id", referencedColumnName: "id" })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children?: Comment[];
}
