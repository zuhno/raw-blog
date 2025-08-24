import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { RequestUser } from "../../shared/decorators/request-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import type { TRequestUser } from "../../shared/utils/type";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @RequireUser()
  create(@RequestUser() user: TRequestUser, @Body() body: CreateCommentDto) {
    return this.commentsService.create(user.id, body);
  }

  @Get()
  list(@Query("contentId", ParseIntPipe) contentId: number) {
    return this.commentsService.list(contentId);
  }

  @Patch(":id")
  @RequireUser()
  update(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateCommentDto
  ) {
    return this.commentsService.update(id, user.id, body);
  }

  @Delete(":id")
  @RequireUser()
  remove(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.commentsService.remove(id, user.id);
  }
}
