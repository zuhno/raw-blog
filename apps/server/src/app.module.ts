import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "./config/database/database.module";
import { DatabaseService } from "./config/database/database.service";
import { HealthCheckModule } from "./config/health-check/health-check.module";
import { JwtCoreModule } from "./config/jwt/jwt-core.module";
import { SecurityConfigModule } from "./config/security/security.module";
import { AnalysisModule } from "./features/analysis/analysis.module";
import { AuthModule } from "./features/auth/auth.module";
import { CommentsModule } from "./features/comments/comments.module";
import { ContentsModule } from "./features/contents/contents.module";
import { FilesModule } from "./features/files/files.module";
import { TagsModule } from "./features/tags/tags.module";
import { UsersModule } from "./features/users/users.module";
import { VisitorsModule } from "./features/visitors/visitors.module";

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
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60, // 1m (block duration default value is from ttl)
        limit: 30,
      },
    ]),
    HealthCheckModule,

    // API Module
    AuthModule,
    ContentsModule,
    TagsModule,
    CommentsModule,
    UsersModule,
    FilesModule,
    VisitorsModule,
    AnalysisModule,

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
          {
            path: "files",
            module: FilesModule,
          },
          {
            path: "visitors",
            module: VisitorsModule,
          },
          {
            path: "analysis",
            module: AnalysisModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
