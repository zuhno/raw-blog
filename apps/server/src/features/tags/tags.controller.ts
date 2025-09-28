import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

import { TagsService } from "./tags.service";

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  listWithCount() {
    return this.tagsService.listWithCount();
  }

  @Get("name/:name")
  searchByName(@Param("name") name: string) {
    return this.tagsService.searchByName(name);
  }

  @Get("id/:id")
  searchById(@Param("id", ParseIntPipe) id: number) {
    return this.tagsService.searchById(id);
  }
}
