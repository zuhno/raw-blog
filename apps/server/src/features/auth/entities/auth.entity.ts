import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";

import { SignupPlatform } from "../../../shared/utils/type";
import { User } from "../../users/entities/user.entity";

@Entity("auth")
export class Auth {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;

  @Column({ type: "varchar", name: "user_agent" })
  userAgent!: string;

  @Column({ type: "bool", default: false })
  used?: boolean;

  @Column({ type: "enum", enum: SignupPlatform })
  platform!: SignupPlatform;

  @Column({ type: "timestamp", name: "expires_at" })
  expiresAt!: Date;

  @CreateDateColumn({ type: "timestamp", name: "issued_at" })
  issuedAt!: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt!: Date;
}
