import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { CreateTagDto } from "./dto/create-tag.dto";
import { CreateTagsDto } from "./dto/create-tags.dto";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;

    const tagEntity = this.tagRepository.create({ name });
    return this.tagRepository.save(tagEntity);
  }

  async bulkCreate(createTagsDto: CreateTagsDto) {
    const { names } = createTagsDto;
    const newNames = names.map((name) => ({ name }));

    const tagsEntities = this.tagRepository.create(newNames);
    return this.tagRepository.save(tagsEntities);
  }

  async search(name: string) {
    return this.tagRepository.find({ where: { name: Like(`%${name}%`) } });
  }

  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
