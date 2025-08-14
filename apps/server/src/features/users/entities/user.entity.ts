import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar" })
  nickname!: string;

  @Column({ type: "varchar", nullable: true })
  avatar_url?: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @CreateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
