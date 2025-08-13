import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAndCreate(data: { email: string; nickname: string; avatarUrl?: string }) {
    let user = await this.findByEmail(data.email);

    if (!user) {
      const newUser = this.userRepository.create({
        ...data,
      });
      user = await this.userRepository.save(newUser);
    }

    return user;
  }
}
