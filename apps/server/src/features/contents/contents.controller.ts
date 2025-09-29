import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";

import { ContentsService } from "./contents.service";
import { ListQuery } from "./dto/content-list.dto";
import { CreateContentDto } from "./dto/create-content.dto";
import { UpdateContentDto } from "./dto/update-content.dto";
import { RequestUser } from "../../shared/decorators/request-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import { COOKIE_KEY_VISITOR_ID } from "../../shared/utils/constant";
import type { TRequestUser } from "../../shared/utils/type";

@Controller()
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @RequireUser()
  create(@RequestUser() user: TRequestUser, @Body() body: CreateContentDto) {
    return this.contentsService.create(user.id, body);
  }

  @Get(":id/verify")
  @RequireUser()
  verify(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.contentsService.verify(id, user.id);
  }

  @Get()
  list(@Query() query: ListQuery) {
    return this.contentsService.list(
      query.type,
      query.tagIds,
      query.offset,
      query.limit,
      query.sort,
      query.owner
    );
  }

  @Get(":id")
  @RequireUser({ strict: false })
  detail(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    const visitorId: string = req.cookies[COOKIE_KEY_VISITOR_ID];

    return this.contentsService.detail(id, user?.id, visitorId);
  }

  @Patch(":id")
  @RequireUser()
  update(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateContentDto
  ) {
    return this.contentsService.update(id, user.id, body);
  }

  @Delete(":id")
  @RequireUser()
  delete(
    @RequestUser() user: TRequestUser,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.contentsService.delete(id, user.id);
  }
}
