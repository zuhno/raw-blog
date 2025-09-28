import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";

import { CreateTagDto } from "./dto/create-tag.dto";
import { CreateTagsDto } from "./dto/create-tags.dto";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private repo: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto) {
    const { name } = createTagDto;

    const tagEntity = this.repo.create({ name });
    return this.repo.save(tagEntity);
  }

  async createMany(createTagsDto: CreateTagsDto) {
    const { names } = createTagsDto;
    const newNames = names.map((name) => ({ name }));

    const tagsEntities = this.repo.create(newNames);
    return this.repo.save(tagsEntities);
  }

  async findAndCreateMany(tagNames: string[] = []) {
    if (tagNames.length === 0) return [];

    const existingTags = await this.repo.findBy({ name: In(tagNames) });
    const existingTagNames = existingTags.map((tag) => tag.name);
    const newTagNames = tagNames.filter(
      (name) => !existingTagNames.includes(name)
    );

    let newTags: Tag[] = [];
    if (newTagNames.length > 0) {
      newTags = await this.createMany({ names: newTagNames });
    }

    return [...existingTags, ...newTags];
  }

  async searchByName(name: string) {
    return this.repo.find({ where: { name: Like(`%${name}%`) } });
  }

  async searchById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async listWithCount() {
    return this.repo
      .createQueryBuilder("t")
      .innerJoin("t.contents", "c", "c.publish = :pub AND c.private = :priv", {
        pub: true,
        priv: false,
      })
      .distinct(true)
      .loadRelationCountAndMap("t.contentsCount", "t.contents", "vc", (qb) =>
        qb
          .where("vc.publish = :pub", { pub: true })
          .andWhere("vc.private = :priv", { priv: false })
      )
      .orderBy("t.id", "ASC")
      .getMany();
  }
}
