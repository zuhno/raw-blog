import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Visitor } from "./entities/visitor.entity";
import { VisitorsController } from "./visitors.controller";
import { VisitorsService } from "./visitors.service";

@Module({
  imports: [TypeOrmModule.forFeature([Visitor])],
  providers: [VisitorsService],
  controllers: [VisitorsController],
  exports: [VisitorsService],
})
export class VisitorsModule {}
