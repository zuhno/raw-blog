import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { ALLOWED_ORIGINS } from "./config/tokens";
import { AllExceptionsFilter } from "./shared/filters/exceptions.filter";
import { ResponseInterceptor } from "./shared/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowed = app.get<string[]>(ALLOWED_ORIGINS);

  app.set("trust proxy", true);
  app.enableCors({ origin: allowed, credentials: true });
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  await app.listen(8080);
}

bootstrap();
