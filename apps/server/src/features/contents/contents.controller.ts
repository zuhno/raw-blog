import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";

import { ContentsService } from "./contents.service";
import type { CreateContentDto } from "./dto/create-content.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { ReqUser } from "../../shared/decorators/req-user.decorator";
import { RequireUser } from "../../shared/decorators/require-user.decorator";
import type { RequestUser } from "../../shared/utils/type";

@Controller("contents")
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @RequireUser()
  create(@ReqUser() user: RequestUser, @Body() createContentDto: CreateContentDto) {
    const authorId = 1;
    return this.contentsService.create(authorId, createContentDto);
  }

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.contentsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.contentsService.remove(id);
  }
}
