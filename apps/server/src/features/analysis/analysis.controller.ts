import { Controller, Get, Query } from "@nestjs/common";

import { AnalysisService } from "./analysis.service";
import { GetStatisticsDto } from "./dto/get-statistics.dto";
import { RequireUser } from "../../shared/decorators/require-user.decorator";

@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get("visitor-stats")
  @RequireUser()
  getVisitorStats(@Query() getStatisticsDto: GetStatisticsDto) {
    return this.analysisService.getVisitorStats(getStatisticsDto);
  }
}
