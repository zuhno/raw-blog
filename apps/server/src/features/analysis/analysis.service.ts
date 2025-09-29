import { Injectable } from "@nestjs/common";

import { VisitorsService } from "../visitors/visitors.service";
import { GetStatisticsDto } from "./dto/get-statistics.dto";

@Injectable()
export class AnalysisService {
  constructor(private readonly visitorsService: VisitorsService) {}

  getVisitorStats(getStatisticsDto: GetStatisticsDto) {
    return this.visitorsService.getVisitorStats(getStatisticsDto);
  }
}
