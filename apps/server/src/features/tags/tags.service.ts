import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateTagDto } from "./dto/create-tag.dto";
import { CreateTagsDto } from "./dto/create-tags.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;

    const newTag = this.tagRepository.create({ name });
    return this.tagRepository.save(newTag);
  }

  async bulkCreate(createTagsDto: CreateTagsDto) {
    const { names } = createTagsDto;
    console.log(names);
  }

  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
