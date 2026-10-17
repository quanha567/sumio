import { initContract } from "@ts-rest/core";

import { authContract } from "./auth/auth.contract.js";
import { categoryContract, transactionContract } from "./transaction/transaction.contract.js";

export * from "./auth/auth.contract.js";
export * from "./auth/auth.schema.js";
export * from "./common/response.schema.js";
export * from "./transaction/transaction.contract.js";
export * from "./transaction/transaction.schema.js";

const c = initContract();

export const apiContract = c.router({
  auth: authContract,
  transactions: transactionContract,
  categories: categoryContract,
});

export type ApiContract = typeof apiContract;
