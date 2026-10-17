import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { ErrorResponseSchema } from "../common/response.schema.js";
import {
  CategoryListSchema,
  CreateTransactionSchema,
  ListTransactionsQuerySchema,
  TransactionListSchema,
  TransactionSchema,
  UpdateTransactionSchema,
} from "./transaction.schema.js";

const c = initContract();

const headers = z.object({ authorization: z.string().startsWith("Bearer ") });

export const transactionContract = c.router({
  list: {
    method: "GET",
    path: "/api/transactions",
    headers,
    query: ListTransactionsQuerySchema,
    responses: {
      200: TransactionListSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
    },
    summary: "List the current user's transactions with filters and pagination",
  },
  create: {
    method: "POST",
    path: "/api/transactions",
    headers,
    body: CreateTransactionSchema,
    responses: {
      201: TransactionSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
    },
    summary: "Create a transaction",
  },
  update: {
    method: "PATCH",
    path: "/api/transactions/:id",
    headers,
    pathParams: z.object({ id: z.string().uuid() }),
    body: UpdateTransactionSchema,
    responses: {
      200: TransactionSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
      404: ErrorResponseSchema,
    },
    summary: "Update a transaction (404 if it does not belong to the user)",
  },
  remove: {
    method: "DELETE",
    path: "/api/transactions/:id",
    headers,
    pathParams: z.object({ id: z.string().uuid() }),
    body: c.noBody(),
    responses: {
      204: z.undefined(),
      401: ErrorResponseSchema,
      404: ErrorResponseSchema,
    },
    summary: "Permanently delete a transaction",
  },
});

export const categoryContract = c.router({
  list: {
    method: "GET",
    path: "/api/categories",
    headers,
    responses: {
      200: CategoryListSchema,
      401: ErrorResponseSchema,
    },
    summary: "List the current user's categories",
  },
});
