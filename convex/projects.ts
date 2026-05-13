import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ───────────────────────────────────────
// Public queries (no auth required)
// ───────────────────────────────────────

/** List all projects, ordered by `order` */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_order").order("asc").collect();
  },
});

/** List featured projects, ordered by featuredOrder */
export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_featured_order")
      .filter((q) => q.neq(q.field("featuredOrder"), undefined))
      .order("asc")
      .collect();
  },
});

/** List projects filtered by category */
export const listByCategory = query({
  args: {
    category: v.union(
      v.literal("Office"),
      v.literal("Healthcare"),
      v.literal("Commercial"),
      v.literal("Industrial"),
      v.literal("Residential"),
      v.literal("Interior"),
    ),
  },
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category_order", (q) => q.eq("category", category))
      .order("asc")
      .collect();
  },
});

/** Get a single project by slug (for public detail pages) */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

/** Get a single project by ID (for admin edit page) */
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// ───────────────────────────────────────
// Admin mutations (require auth)
// ───────────────────────────────────────

/** Create a new project */
export const create = mutation({
  args: {
    slug: v.string(),
    title_bg: v.string(),
    title_en: v.string(),
    description_bg: v.optional(v.string()),
    description_en: v.optional(v.string()),
    location_bg: v.string(),
    location_en: v.string(),
    investor_bg: v.string(),
    investor_en: v.string(),
    category: v.union(
      v.literal("Office"),
      v.literal("Healthcare"),
      v.literal("Commercial"),
      v.literal("Industrial"),
      v.literal("Residential"),
      v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),
    featuredOrder: v.optional(v.number()),
    status: v.union(v.literal("done"), v.literal("in-progress")),
    awards: v.array(
      v.object({
        text_bg: v.string(),
        text_en: v.string(),
      }),
    ),
    images: v.array(
      v.object({
        storageId: v.optional(v.id("_storage")),
        ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
        url_legacy: v.optional(v.string()),
      }),
    ),
    details: v.optional(
      v.array(
        v.object({
          name_bg: v.string(),
          name_en: v.string(),
          area: v.number(),
        }),
      ),
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Update an existing project */
export const update = mutation({
  args: {
    id: v.id("projects"),
    slug: v.string(),
    title_bg: v.string(),
    title_en: v.string(),
    description_bg: v.optional(v.string()),
    description_en: v.optional(v.string()),
    location_bg: v.string(),
    location_en: v.string(),
    investor_bg: v.string(),
    investor_en: v.string(),
    category: v.union(
      v.literal("Office"),
      v.literal("Healthcare"),
      v.literal("Commercial"),
      v.literal("Industrial"),
      v.literal("Residential"),
      v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),
    featuredOrder: v.optional(v.number()),
    status: v.union(v.literal("done"), v.literal("in-progress")),
    awards: v.array(
      v.object({
        text_bg: v.string(),
        text_en: v.string(),
      }),
    ),
    images: v.array(
      v.object({
        storageId: v.optional(v.id("_storage")),
        ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
        url_legacy: v.optional(v.string()),
      }),
    ),
    details: v.optional(
      v.array(
        v.object({
          name_bg: v.string(),
          name_en: v.string(),
          area: v.number(),
        }),
      ),
    ),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { id, ...fields } = args;
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

/** Delete a project and all its storage files */
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");

    // Delete all storage files associated with this project
    for (const image of project.images) {
      if (image.storageId) {
        await ctx.storage.delete(image.storageId);
      }
    }

    await ctx.db.delete(id);
  },
});

/** List all unique images across all projects and posts (for gallery reuse) */
export const listAllImages = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    const posts = await ctx.db.query("posts").collect();
    const seen = new Set<string>();
    const images: Array<{
      storageId: string;
      ar: "L" | "S" | "V";
      url_legacy?: string;
      url?: string;
      projectName: string;
      projectId: string;
    }> = [];

    for (const project of projects) {
      for (const image of project.images) {
        if (image.storageId && !seen.has(image.storageId)) {
          seen.add(image.storageId);
          const url = await ctx.storage.getUrl(image.storageId);
          images.push({
            storageId: image.storageId,
            ar: image.ar,
            url_legacy: image.url_legacy,
            url: url ?? undefined,
            projectName: project.title_bg,
            projectId: project._id,
          });
        }
      }
    }

    // Also include blog post images (gallery + cover)
    for (const post of posts) {
      // Cover image
      if (post.coverImage && !seen.has(post.coverImage)) {
        seen.add(post.coverImage);
        const url = await ctx.storage.getUrl(post.coverImage);
        images.push({
          storageId: post.coverImage,
          ar: "L",
          url: url ?? undefined,
          projectName: post.title_bg,
          projectId: post._id,
        });
      }

      // Gallery images
      for (const image of post.images) {
        if (image.storageId && !seen.has(image.storageId)) {
          seen.add(image.storageId);
          const url = await ctx.storage.getUrl(image.storageId);
          images.push({
            storageId: image.storageId,
            ar: "L",
            url_legacy: image.url_legacy,
            url: url ?? undefined,
            projectName: post.title_bg,
            projectId: post._id,
          });
        }
      }
    }

    return images;
  },
});

/** Update `order` field for drag-reorder */
export const reorder = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id("projects"),
        order: v.number(),
      }),
    ),
  },
  handler: async (ctx, { orders }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    for (const { id, order } of orders) {
      await ctx.db.patch(id, { order, updatedAt: Date.now() });
    }
  },
});

/** Update featured order — assign order values to featured projects */
export const reorderFeatured = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id("projects"),
        featuredOrder: v.number(),
      }),
    ),
  },
  handler: async (ctx, { orders }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    for (const { id, featuredOrder } of orders) {
      await ctx.db.patch(id, { featuredOrder, updatedAt: Date.now() });
    }
  },
});

/** Remove a project from featured list */
export const removeFeatured = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(id, { featuredOrder: undefined, updatedAt: Date.now() });
  },
});

/** Add a project to featured list (appends to end) */
export const addFeatured = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Find the next available order number
    const allFeatured = await ctx.db
      .query("projects")
      .withIndex("by_featured_order")
      .filter((q) => q.neq(q.field("featuredOrder"), undefined))
      .order("desc")
      .first();

    const nextOrder = allFeatured ? (allFeatured.featuredOrder ?? 0) + 1 : 0;
    await ctx.db.patch(id, { featuredOrder: nextOrder, updatedAt: Date.now() });
  },
});