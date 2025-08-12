import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";

import { AuthModule } from "./api/auth/auth.module";

@Module({
  imports: [
    // Config ENV
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
    }),
    // API Module
    AuthModule,
    // Router
    RouterModule.register([
      {
        path: "auth",
        module: AuthModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
