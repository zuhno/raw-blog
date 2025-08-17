import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

import { SignupPlatform } from "../../../shared/utils/type";
import { User } from "../../users/entities/user.entity";

@Entity("auth")
export class Auth {
  @PrimaryColumn("uuid")
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

  @Column({ type: "bool", default: false })
  logout?: boolean;

  @Column({ type: "bool", default: false })
  invalid?: boolean;

  @Column({ type: "enum", enum: SignupPlatform })
  platform!: SignupPlatform;

  @CreateDateColumn({ type: "timestamptz", name: "issued_at" })
  issuedAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;
}
