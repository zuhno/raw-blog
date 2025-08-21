import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContentsController } from "./contents.controller";
import { ContentsService } from "./contents.service";
import { Content } from "./entities/content.entity";
import { Tag } from "../tags/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Content, Tag])],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
