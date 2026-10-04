import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { User } from "../../domain/entities/user.entity.js";

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<{ user?: User }>();
  if (!request.user) {
    throw new Error("CurrentUser decorator used on an unauthenticated route.");
  }
  return request.user;
});
