import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContentsController } from "./contents.controller";
import { ContentsService } from "./contents.service";
import { Content } from "./entities/content.entity";
import { TagsModule } from "../tags/tags.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Content]), UsersModule, TagsModule],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
