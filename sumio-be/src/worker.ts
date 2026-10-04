import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { httpServerHandler } from "cloudflare:node";

import { AppModule } from "./app.module.js";

const app = await NestFactory.create(AppModule, {
  logger: ["error", "warn", "log"],
});

app.enableCors({
  origin: "*",
  credentials: true,
});

await app.listen(8080);

export default httpServerHandler({ port: 8080 });
