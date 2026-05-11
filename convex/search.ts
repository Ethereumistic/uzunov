import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Unified lightweight search across projects and published posts.
 *
 * Strategy: dataset is small, so we full-scan in-memory with case-insensitive
 * includes().  This avoids extra indexes and keeps the query cheap (single
 * function invocation, no pagination overhead).
 *
 * Returns at most `limit` results total, mixed by type.
 */
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { query: q, limit }) => {
    const max = Math.min(limit ?? 10, 20);
    const term = q.trim().toLowerCase();

    if (term.length < 2) return [];

    // ── Projects ──────────────────────────────────────────
    const projects = await ctx.db.query("projects").collect();
    const matchedProjects = projects
      .filter((p) => {
        const haystack = [
          p.title_bg,
          p.title_en,
          p.description_bg,
          p.description_en,
          p.location_bg,
          p.location_en,
          p.category,
          p.investor_bg,
          p.investor_en,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, max)
      .map((p) => ({
        type: "project" as const,
        slug: p.slug,
        title_bg: p.title_bg,
        title_en: p.title_en,
        category: p.category,
      }));

    // ── Posts (published only) ────────────────────────────
    const posts = await ctx.db.query("posts").collect();
    const matchedPosts = posts
      .filter((p) => {
        if (!p.published) return false;
        const haystack = [
          p.title_bg,
          p.title_en,
          p.excerpt_bg,
          p.excerpt_en,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, max)
      .map((p) => ({
        type: "post" as const,
        slug: p.slug,
        title_bg: p.title_bg,
        title_en: p.title_en,
        displayDate: p.displayDate,
      }));

    // Interleave: take up to `max` across both types
    const results: Array<(typeof matchedProjects)[number] | (typeof matchedPosts)[number]> = [];
    const pi = { v: 0 };
    const oi = { v: 0 };

    while (results.length < max && (pi.v < matchedProjects.length || oi.v < matchedPosts.length)) {
      if (pi.v < matchedProjects.length) results.push(matchedProjects[pi.v++]);
      if (results.length < max && oi.v < matchedPosts.length) results.push(matchedPosts[oi.v++]);
    }

    return results;
  },
});
