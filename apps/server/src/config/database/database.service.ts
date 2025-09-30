import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProd = process.env.NODE_ENV === "production";
    return {
      type: "postgres",
      url: this.configService.get<string>("DB_URL"),
      autoLoadEntities: true,
      synchronize: false,
      ssl: isProd ? { rejectUnauthorized: false } : false,
    };
  }
}
