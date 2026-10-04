import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:5173", "https://sumio-dev.pages.dev", "https://sumio.pages.dev"],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Sumio Backend is running on: http://localhost:${port}`);
}

await bootstrap();
