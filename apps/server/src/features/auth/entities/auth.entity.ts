import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ESignupPlatform } from "../../../shared/utils/type";
import { User } from "../../users/entities/user.entity";

@Entity("auth")
export class Auth {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", name: "user_agent" })
  userAgent!: string;

  @Column({ type: "bool", default: false })
  used?: boolean;

  @Column({ type: "bool", default: false })
  logout?: boolean;

  @Column({ type: "bool", default: false })
  invalid?: boolean;

  @Column({ type: "enum", enum: ESignupPlatform })
  platform!: ESignupPlatform;

  @CreateDateColumn({ type: "timestamptz", name: "issued_at" })
  issuedAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, {
    cascade: false,
    nullable: false,
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: User;
}
