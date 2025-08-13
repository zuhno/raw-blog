import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

const PORT = process.env.PORT ?? 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: JSON.parse(decodeURIComponent(process.env.ALLOW_ACCESS_ORIGIN!)),
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
