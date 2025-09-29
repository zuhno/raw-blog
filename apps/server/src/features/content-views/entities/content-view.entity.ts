import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from "typeorm";

import { Content } from "../../contents/entities/content.entity";

@Entity("content_views")
@Index(["content", "visitorId"], { unique: true })
export class ContentView {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", name: "visitor_id", length: 36 })
  visitorId!: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @ManyToOne(() => Content, {
    cascade: false,
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "content_id", referencedColumnName: "id" })
  content!: Content;
}
