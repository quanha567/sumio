import { QueryClient } from "@tanstack/react-query";

import { QueryStaleTime } from "./query-constants";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QueryStaleTime.Medium,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
