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
  RelationId,
} from "typeorm";

import { User } from "../../../features/users/entities/user.entity";
import { Tag } from "../../tags/entities/tag.entity";

@Entity("content")
export class Content {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne(() => User, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  author!: User;

  @RelationId((content: Content) => content.author)
  authorId!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "boolean", default: false })
  publish!: boolean;

  @Column({ type: "boolean", default: false })
  private!: boolean;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;

  @ManyToMany(() => Tag, (tag) => tag.contents, {
    cascade: false,
    eager: false,
  })
  @JoinTable({
    name: "content_tag",
    joinColumn: { name: "content_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags!: Tag[];
}
