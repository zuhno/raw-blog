import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "./config/database/database.module";
import { DatabaseService } from "./config/database/database.service";
import { AuthModule } from "./features/auth/auth.module";

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseService,
      inject: [DatabaseService],
    }),

    // API Module
    AuthModule,

    // Router
    RouterModule.register([
      {
        path: "api",
        children: [
          {
            path: "auth",
            module: AuthModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
