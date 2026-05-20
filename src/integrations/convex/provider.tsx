import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { ConvexProvider } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}

export const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

let _queryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (_queryClient) return _queryClient;

  _queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Tell TanStack Query how to hash Convex query keys and execute queries
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        // Keep cached results for 60 seconds after last observer unmounts.
        // This enables instant back-navigation renders without refetching.
        gcTime: 60_000,
      },
    },
  });

  // Wire ConvexQueryClient into TanStack Query so all queries route through
  // the cache layer with gcTime control instead of raw WebSocket subscriptions
  convexQueryClient.connect(_queryClient);

  return _queryClient;
}

// Expose the connected queryClient so root-provider.tsx and router.tsx can type against it
export const queryClient = (() => {
  // Initialize eagerly so connect() runs before any component mounts
  if (!_queryClient) getQueryClient();
  return _queryClient!;
})();

export default function AppConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      <ConvexAuthProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexAuthProvider>
    </ConvexProvider>
  );
}