import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async findAll() {
    return this.repo.find();
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findAndCreate(data: {
    email: string;
    nickname: string;
    avatarUrl?: string;
  }) {
    let user = await this.findByEmail(data.email);

    if (!user) {
      const newUser = this.repo.create({
        ...data,
      });
      user = await this.repo.save(newUser);
    }

    return user;
  }
}
