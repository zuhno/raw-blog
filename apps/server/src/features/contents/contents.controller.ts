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

import { ContentsService } from "./contents.service";
import type { ListQuery } from "./dto/content-list.dto";
import type { CreateContentDto } from "./dto/create-content.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { RequestUser } from "../../shared/decorators/request-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import type { TRequestUser } from "../../shared/utils/type";

@Controller()
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @RequireUser()
  create(
    @RequestUser() user: TRequestUser,
    @Body() createContentDto: CreateContentDto
  ) {
    return this.contentsService.create(user.id, createContentDto);
  }

  @Get()
  list(@RequestUser() user: TRequestUser, @Query() query: ListQuery) {
    const isMine = user?.id === query.authorId;
    return this.contentsService.list(
      query.authorId,
      query.tagIds,
      query.offset,
      query.limit,
      query.sort,
      isMine
    );
  }

  @Get(":id")
  detail(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.contentsService.detail(id, user?.id);
  }

  @Patch(":id")
  @RequireUser()
  update(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto
  ) {
    return this.contentsService.update(id, updateContentDto);
  }
}
