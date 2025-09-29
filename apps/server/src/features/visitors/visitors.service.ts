import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Visitor } from "./entities/visitor.entity";
import { GetStatisticsDto } from "../analysis/dto/get-statistics.dto";

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly repo: Repository<Visitor>
  ) {}

  async getVisitorStats({ startDate, endDate }: GetStatisticsDto) {
    const query = this.repo
      .createQueryBuilder("v")
      .select(["to_char(v.visit_date_kst, 'YYYY-MM-DD') AS date"])
      .addSelect("COUNT(v.id)::int", "count")
      .groupBy("v.visit_date_kst")
      .orderBy("v.visit_date_kst", "ASC");

    if (startDate) {
      query.andWhere("v.visited_at >= :startDate", { startDate });
    }

    if (endDate) {
      query.andWhere("v.visited_at <= :endDate", { endDate });
    }

    return query.getRawMany<{ date: string; count: number }>();
  }

  async logVisitor(visitorId: string): Promise<void> {
    try {
      const now = new Date();
      const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const visitDateKst = kstDate.toISOString().split("T")[0];

      const newVisitor = this.repo.create({ visitorId, visitDateKst });
      await this.repo.save(newVisitor);
    } catch (error) {
      if (
        error.code !== "ER_DUP_ENTRY" &&
        error.driverError?.code !== "23505"
      ) {
        console.error("Failed to log visitor:", error);
      }
    }
  }
}
