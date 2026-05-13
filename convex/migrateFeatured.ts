import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Migration: Convert `featured: boolean` → `featuredOrder?: number`
 * - Projects with `featured: true` get `featuredOrder: 0`
 * - Projects with `featured: false` get `featuredOrder: undefined` (field removed)
 */
export const migrateFeaturedToFeaturedOrder = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    let updated = 0;
    let skipped = 0;

    for (const project of projects) {
      // Check if project has the old `featured` field
      const hasFeatured = "featured" in project;
      if (!hasFeatured) {
        skipped++;
        continue;
      }

      const wasFeatured = (project as any).featured === true;
      const newFeaturedOrder = wasFeatured ? 0 : undefined;

      // Patch: remove `featured`, set `featuredOrder`
      await ctx.db.patch(project._id, {
        featured: undefined, // remove old field
        featuredOrder: newFeaturedOrder,
      } as any);

      updated++;
    }

    return { updated, skipped };
  },
});