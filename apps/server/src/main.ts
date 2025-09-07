import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { ALLOWED_ORIGINS } from "./config/tokens";
import { AllExceptionsFilter } from "./shared/filters/exceptions.filter";
import { ResponseInterceptor } from "./shared/interceptors/response.interceptor";

const PORT = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowed = app.get<string[]>(ALLOWED_ORIGINS);

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

  await app.listen(PORT);
}

bootstrap();
