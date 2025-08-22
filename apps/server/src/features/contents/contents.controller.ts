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
import type { ListWithPublicQuery } from "./dto/content-list.dto";
import type { CreateContentDto } from "./dto/create-content.dto";
import type { DetailWithPublicParam } from "./dto/detail.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { ReqUser } from "../../shared/decorators/req-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import type { RequestUser } from "../../shared/utils/type";

@Controller("contents")
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @RequireUser()
  create(
    @ReqUser() user: RequestUser,
    @Body() createContentDto: CreateContentDto
  ) {
    return this.contentsService.create(user.id, createContentDto);
  }

  @Get()
  listWithPublic(@Query() query: ListWithPublicQuery) {
    return this.contentsService.findManyPublicWithPagination(
      query.authorId,
      query.tagIds,
      query.page,
      query.pageSize,
      query.total
    );
  }

  @Get(":id")
  detailWithPublic(@Param() params: DetailWithPublicParam) {
    return this.contentsService.findOneByIdWithPublic(params.id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto
  ) {
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.contentsService.remove(id);
  }
}
