import { Module } from "@nestjs/common";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { DatabaseModule } from "@/database/database.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { CategoryModule } from "@/modules/category/category.module";
import { TransactionModule } from "@/modules/transaction/transaction.module";
import { UserModule } from "@/modules/user/user.module";

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, CategoryModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
