import { Controller, Get, Param } from "@nestjs/common";

import { TagsService } from "./tags.service";

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get(":name")
  search(@Param("name") name: string) {
    return this.tagsService.searchByName(name);
  }
}
