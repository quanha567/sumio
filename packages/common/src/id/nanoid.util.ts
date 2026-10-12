import { customAlphabet, nanoid } from "nanoid";

export { customAlphabet, nanoid };

/**
 * Standard friendly URL-safe ID generator with 12 characters length (fast & collision-resistant).
 */
export const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);
