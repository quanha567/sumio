if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env might not exist in production/CI, ignore
  }
}

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@/app.module";
import { DomainExceptionFilter } from "@/shared";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new DomainExceptionFilter());

  app.enableCors({
    origin: ["http://localhost:5173", "https://sumio-dev.pages.dev", "https://sumio.pages.dev"],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port, "0.0.0.0");
  Logger.log(`🚀 Sumio Backend is running on: http://localhost:${port}`, "Bootstrap");
}

await bootstrap();
