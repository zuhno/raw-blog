import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContentsController } from "./contents.controller";
import { ContentsService } from "./contents.service";
import { Content } from "./entities/content.entity";
import { ContentViewsModule } from "../content-views/content-views.module";
import { TagsModule } from "../tags/tags.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    UsersModule,
    TagsModule,
    ContentViewsModule,
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
