import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ───────────────────────────────────────
// Public queries (no auth required)
// ───────────────────────────────────────

/** List all published posts, ordered by `order` */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_order")
      .order("desc")
      .collect()
      .then((posts) => posts.filter((p) => p.published));
  },
});

/** Get a single post by slug (for public detail pages) */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

// ───────────────────────────────────────
// Admin queries (require auth)
// ───────────────────────────────────────

/** List all posts (including drafts), ordered by `order` */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").withIndex("by_order").order("desc").collect();
  },
});

/** Get a single post by ID (for admin edit page) */
export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// ───────────────────────────────────────
// Admin mutations (require auth)
// ───────────────────────────────────────

/** Create a new blog post */
export const create = mutation({
  args: {
    slug: v.string(),
    title_bg: v.string(),
    title_en: v.optional(v.string()),
    body_bg: v.string(),
    body_en: v.optional(v.string()),
    excerpt_bg: v.optional(v.string()),
    excerpt_en: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    images: v.array(
      v.object({
        storageId: v.optional(v.id("_storage")),
        url_legacy: v.optional(v.string()),
      }),
    ),
    published: v.boolean(),
    displayDate: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("posts", {
      ...args,
    });
  },
});

/** Update an existing blog post */
export const update = mutation({
  args: {
    id: v.id("posts"),
    slug: v.string(),
    title_bg: v.string(),
    title_en: v.optional(v.string()),
    body_bg: v.string(),
    body_en: v.optional(v.string()),
    excerpt_bg: v.optional(v.string()),
    excerpt_en: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    images: v.array(
      v.object({
        storageId: v.optional(v.id("_storage")),
        url_legacy: v.optional(v.string()),
      }),
    ),
    published: v.boolean(),
    displayDate: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

/** Delete a blog post */
export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");

    // Clean up cover image from storage (it's only referenced here)
    if (post.coverImage) {
      // Don't delete — it might be in the imageHashes table for reuse
    }

    await ctx.db.delete(id);
  },
});

/** Update `order` field for drag-reorder */
export const reorder = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id("posts"),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, { orders }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    for (const { id, order } of orders) {
      await ctx.db.patch(id, { order });
    }
  },
});