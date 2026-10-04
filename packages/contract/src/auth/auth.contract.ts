import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorResponseSchema } from "../common/response.schema.js";
import {
  UpdateUserSettingsSchema,
  UserProfileSchema,
  UserSettingsSchema,
} from "./auth.schema.js";

const c = initContract();

export const authContract = c.router({
  getMe: {
    method: "GET",
    path: "/api/auth/me",
    headers: z.object({
      authorization: z.string().startsWith("Bearer "),
    }),
    responses: {
      200: UserProfileSchema,
      401: ErrorResponseSchema,
    },
    summary: "Get current authenticated user profile and settings",
  },
  updateSettings: {
    method: "PATCH",
    path: "/api/auth/settings",
    headers: z.object({
      authorization: z.string().startsWith("Bearer "),
    }),
    body: UpdateUserSettingsSchema,
    responses: {
      200: UserSettingsSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
    },
    summary: "Update user financial display and locale preferences",
  },
});
