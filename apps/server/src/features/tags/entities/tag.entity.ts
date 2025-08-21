import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
} from "typeorm";

import { Content } from "../../contents/entities/content.entity";

@Entity("tag")
export class Tag {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Index({ unique: true })
  @Column({ type: "varchar" })
  name!: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;

  @ManyToMany(() => Content, (content) => content.tags)
  contents!: Content[];
}
