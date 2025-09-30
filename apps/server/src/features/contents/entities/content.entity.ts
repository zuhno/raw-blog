import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { User } from "../../../features/users/entities/user.entity";
import { EContentType } from "../../../shared/utils/type";
import { Tag } from "../../tags/entities/tag.entity";

@Entity("content")
export class Content {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "number", name: "author_id" })
  authorId!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @Column({ type: "boolean", default: false })
  private!: boolean;

  @Column({ type: "enum", enum: EContentType })
  type!: EContentType;

  @Column({ type: "varchar", default: false })
  test: string;

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

  @ManyToMany(() => Tag, (tag) => tag.contents, {
    cascade: false,
    eager: false,
  })
  @JoinTable({
    name: "content_tag",
    joinColumn: {
      name: "content_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags!: Tag[];
}
