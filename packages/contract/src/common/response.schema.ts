import { z } from "zod";

export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
  timestamp: z.string().datetime(),
  path: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
