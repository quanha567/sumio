import { z } from "zod";

export const UserStatusSchema = z.enum(["ACTIVE", "SUSPENDED"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserSettingsSchema = z.object({
  baseCurrency: z.string().min(3).max(3).default("USD"),
  locale: z.string().default("en-US"),
  theme: z.string().default("mint"),
  weekStartsOn: z.number().int().min(0).max(6).default(1),
  updatedAt: z.string().datetime(),
});
export type UserSettingsDto = z.infer<typeof UserSettingsSchema>;

export const UserIdentitySchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  providerUid: z.string(),
  lastSignInAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});
export type UserIdentityDto = z.infer<typeof UserIdentitySchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  photoUrl: z.string().url().nullable(),
  status: UserStatusSchema,
  settings: UserSettingsSchema,
  identities: z.array(UserIdentitySchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type UserProfileDto = z.infer<typeof UserProfileSchema>;

export const UpdateUserSettingsSchema = z.object({
  baseCurrency: z.string().min(3).max(3).optional(),
  locale: z.string().optional(),
  theme: z.string().optional(),
  weekStartsOn: z.number().int().min(0).max(6).optional(),
});
export type UpdateUserSettingsDto = z.infer<typeof UpdateUserSettingsSchema>;
