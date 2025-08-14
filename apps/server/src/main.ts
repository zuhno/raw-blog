import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { ALLOWED_ORIGINS } from "./config/tokens";

const PORT = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowed = app.get<string[]>(ALLOWED_ORIGINS);

  app.enableCors({ origin: allowed, credentials: true });
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
