import { join } from "node:path";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      username: this.configService.get<string>("DB_USER"),
      password: this.configService.get<string>("DB_PASSWORD"),
      port: +this.configService.get<number>("DB_PORT")!,
      host: this.configService.get<string>("DB_HOST"),
      database: this.configService.get<string>("DB_SCHEMA"),
      entities: [join(__dirname, "../../**/*.entity.{ts,js}")],
      synchronize: process.env.NODE_ENV === "production" ? false : true,
    };
  }
}
