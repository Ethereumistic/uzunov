import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedFromJson = internalMutation({
  args: {
    projects: v.array(v.any()),
  },
  handler: async (ctx, { projects }) => {
    // Check if projects already exist to prevent double-seeding
    const existing = await ctx.db.query("projects").first();
    if (existing) {
      console.log("Projects already exist, skipping migration.");
      return { skipped: true };
    }

    for (let i = 0; i < projects.length; i++) {
      const p = projects[i] as any;

      await ctx.db.insert("projects", {
        // Slug from the existing `id` field (already URL-friendly)
        slug: p.id,

        title_bg: p.title,
        title_en: p.title, // placeholder — admin updates EN fields later
        description_bg: p.description ?? undefined,
        description_en: p.description ?? undefined, // placeholder
        location_bg: p.location,
        location_en: p.location, // placeholder
        investor_bg: p.investor,
        investor_en: p.investor, // placeholder

        category: p.category,
        area: p.area ?? undefined,
        completionDate: p.completionDate ?? undefined,
        featuredOrder: p.featured ? 0 : undefined,
        status: p.status,

        awards: (p.awards ?? []).map((a: string) => ({
          text_bg: a,
          text_en: a, // placeholder
        })),

        // Migrated images use url_legacy; storageId left undefined
        images: (p.images ?? []).map((img: any) => ({
          url_legacy: img.url,
          ar: img.ar,
          // storageId is undefined — component will use url_legacy
        })),

        details: (p.details ?? []).map((d: any) => ({
          name_bg: d.name,
          name_en: d.name, // placeholder
          area: d.area,
        })),

        order: i,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { inserted: projects.length };
  },
});