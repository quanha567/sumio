import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { httpServerHandler } from "cloudflare:node";

import { AppModule } from "@/app.module";
import { DomainExceptionFilter } from "@/shared";

const app = await NestFactory.create(AppModule, {
  logger: ["error", "warn", "log"],
});

app.useGlobalFilters(new DomainExceptionFilter());

app.enableCors({
  origin: "*",
  credentials: true,
});

await app.listen(8080);

export default httpServerHandler({ port: 8080 });
