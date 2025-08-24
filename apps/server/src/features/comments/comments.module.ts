import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { Comment } from "./entities/comment.entity";
import { ContentsModule } from "../contents/contents.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, ContentsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
