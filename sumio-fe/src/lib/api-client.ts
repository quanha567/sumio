import { initClient } from "@ts-rest/core";

import { apiContract } from "@sumio/contract";

export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = initClient(apiContract, {
  baseUrl: BASE_API_URL,
  baseHeaders: {},
});
