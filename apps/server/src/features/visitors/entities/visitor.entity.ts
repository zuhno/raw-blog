import {
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

@Entity("visitors")
@Index(["visitorId", "visitDateKst"], { unique: true })
export class Visitor {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", name: "visitor_id", length: 36 })
  visitorId: string;

  @CreateDateColumn({ type: "timestamptz", name: "visited_at" })
  visitedAt: Date;

  @Column({ type: "date", name: "visit_date_kst" })
  visitDateKst: string;
}
