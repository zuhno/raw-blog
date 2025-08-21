import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Tag } from "../../tags/entities/tag.entity";

@Entity({ name: "content" })
export class Content {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
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
