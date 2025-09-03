import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>("GOOGLE_SIGNIN_JWT_SECRET"),
        signOptions: {
          algorithm: "HS256",
          issuer: "raw-blog-server",
          audience: "raw-blog-client",
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtCoreModule {}
