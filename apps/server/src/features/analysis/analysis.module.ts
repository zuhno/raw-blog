import { Module } from "@nestjs/common";

import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";
import { VisitorsModule } from "../visitors/visitors.module";

@Module({
  imports: [VisitorsModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
