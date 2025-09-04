import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "./config/database/database.module";
import { DatabaseService } from "./config/database/database.service";
import { JwtCoreModule } from "./config/jwt/jwt-core.module";
import { SecurityConfigModule } from "./config/security/security.module";
import { AuthModule } from "./features/auth/auth.module";
import { CommentsModule } from "./features/comments/comments.module";
import { ContentsModule } from "./features/contents/contents.module";
import { TagsModule } from "./features/tags/tags.module";
import { UsersModule } from "./features/users/users.module";

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
    }),
    JwtCoreModule,
    SecurityConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseService,
      inject: [DatabaseService],
    }),

    // API Module
    AuthModule,
    ContentsModule,
    TagsModule,
    CommentsModule,
    UsersModule,

    // Router
    RouterModule.register([
      {
        path: "api",
        children: [
          {
            path: "auth",
            module: AuthModule,
          },
          {
            path: "contents",
            module: ContentsModule,
          },
          {
            path: "tags",
            module: TagsModule,
          },
          {
            path: "comments",
            module: CommentsModule,
          },
          {
            path: "users",
            module: UsersModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
