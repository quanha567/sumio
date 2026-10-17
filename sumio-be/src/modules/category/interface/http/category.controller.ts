import { Controller, Inject, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { categoryContract } from "@sumio/contract";

import { CurrentUser, FirebaseAuthGuard, type AuthenticatedUser } from "@/modules/auth";
import { ListCategoriesUseCase } from "@/modules/category/application/queries/list-categories.use-case";

@Controller()
@UseGuards(FirebaseAuthGuard)
export class CategoryController {
  constructor(
    @Inject(ListCategoriesUseCase)
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

  @TsRestHandler(categoryContract.list)
  public list(@CurrentUser() user: AuthenticatedUser) {
    return tsRestHandler(categoryContract.list, async () => {
      const categories = await this.listCategoriesUseCase.execute(user.id);

      return {
        status: 200,
        body: {
          items: categories.map(({ id, name, type, createdAt }) => ({
            id,
            name,
            type,
            createdAt: createdAt.toISOString(),
          })),
        },
      };
    });
  }
}
