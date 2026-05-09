import { query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Extract the Convex user document ID from the identity subject
    // Subject format: "userId|sessionId"
    const userId = identity.subject.split("|")[0];
    const user = await ctx.db.get(userId as any);
    if (!user) return null;

    return {
      email: (user as any).email ?? "User",
      name: (user as any).name ?? undefined,
    };
  },
});