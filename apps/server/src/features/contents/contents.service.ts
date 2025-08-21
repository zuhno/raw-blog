import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";

import type { CreateContentDto } from "./dto/create-content.dto";
import type { UpdateContentDto } from "./dto/update-content.dto";
import { Content } from "./entities/content.entity";
import { Tag } from "../tags/entities/tag.entity";

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentsRepository: Repository<Content>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    private readonly dataSource: DataSource
  ) {}

  async create(authorId: number, createContentDto: CreateContentDto): Promise<Content> {
    const { title, body, publish, private: isPrivate, tags: tagNames } = createContentDto;

    const tags = await this.findOrCreateTags(tagNames);

    const content = this.contentsRepository.create({
      title,
      body,
      publish,
      private: isPrivate,
      authorId,
      tags,
    });

    return this.contentsRepository.save(content);
  }

  findAll() {
    return this.contentsRepository.find({ relations: ["tags"] });
  }

  async findOne(id: number) {
    const content = await this.contentsRepository.findOne({
      where: { id },
      relations: ["tags"],
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  async update(id: number, updateContentDto: UpdateContentDto): Promise<Content> {
    const { tags: tagNames, ...rest } = updateContentDto;

    const content = await this.contentsRepository.preload({
      id,
      ...rest,
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    if (tagNames) {
      content.tags = await this.findOrCreateTags(tagNames);
    }

    return this.contentsRepository.save(content);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
  }

  private async findOrCreateTags(tagNames: string[] = []): Promise<Tag[]> {
    if (tagNames.length === 0) {
      return [];
    }

    const existingTags = await this.tagsRepository.findBy({ name: In(tagNames) });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter((name) => !existingTagNames.includes(name));

    let newTags: Tag[] = [];
    if (newTagNames.length > 0) {
      const newTagEntities = newTagNames.map((name) => this.tagsRepository.create({ name }));
      newTags = await this.tagsRepository.save(newTagEntities);
    }

    return [...existingTags, ...newTags];
  }
}
