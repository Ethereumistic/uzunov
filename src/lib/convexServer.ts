import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL as string;

export function createConvexHttpClient() {
  return new ConvexHttpClient(CONVEX_URL);
}
