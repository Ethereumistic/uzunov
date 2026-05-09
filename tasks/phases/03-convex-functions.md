# Phase 03 — Convex Functions (Queries, Mutations, Sharp Action)

> **Prerequisite:** Phase 02 completed (schema pushed to Convex).
> **Commit message suggestion:** `feat: add project queries, mutations, and image upload pipeline`

---

## Objective

Implement all Convex backend functions: public queries for the website, admin mutations (with auth checks), the image upload pipeline (generate URL → upload raw → Sharp WebP conversion), and a helper query for getting public image URLs.

---

## Step-by-step

### 3.1 — Create `convex/projects.ts`

This file contains all project queries and admin mutations:

```ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ───────────────────────────────────────
// Public queries (no auth required)
// ───────────────────────────────────────

/** List all projects, ordered by `order` */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_featured").order("asc").collect();
  },
});

/** List projects filtered by category */
export const listByCategory = query({
  args: { category: v.union(
    v.literal("Office"),
    v.literal("Healthcare"),
    v.literal("Commercial"),
    v.literal("Industrial"),
    v.literal("Residential"),
    v.literal("Interior"),
  ) },
  handler: async (ctx, { category }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", category))
      .order("asc")
      .collect();
  },
});

/** Get a single project by slug (for public detail pages) */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const results = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    return results ?? null;
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
      v.literal("Office"), v.literal("Healthcare"), v.literal("Commercial"),
      v.literal("Industrial"), v.literal("Residential"), v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),
    featured: v.boolean(),
    status: v.union(v.literal("done"), v.literal("in-progress")),
    awards: v.array(v.object({
      text_bg: v.string(),
      text_en: v.string(),
    })),
    images: v.array(v.object({
      storageId: v.id("_storage"),
      ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
      url_legacy: v.optional(v.string()),
    })),
    details: v.optional(v.array(v.object({
      name_bg: v.string(),
      name_en: v.string(),
      area: v.number(),
    }))),
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
      v.literal("Office"), v.literal("Healthcare"), v.literal("Commercial"),
      v.literal("Industrial"), v.literal("Residential"), v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),
    featured: v.boolean(),
    status: v.union(v.literal("done"), v.literal("in-progress")),
    awards: v.array(v.object({
      text_bg: v.string(),
      text_en: v.string(),
    })),
    images: v.array(v.object({
      storageId: v.id("_storage"),
      ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
      url_legacy: v.optional(v.string()),
    })),
    details: v.optional(v.array(v.object({
      name_bg: v.string(),
      name_en: v.string(),
      area: v.number(),
    }))),
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
      await ctx.storage.delete(image.storageId);
    }

    await ctx.db.delete(id);
  },
});

/** Update `order` field for drag-reorder */
export const reorder = mutation({
  args: {
    orders: v.array(v.object({
      id: v.id("projects"),
      order: v.number(),
    })),
  },
  handler: async (ctx, { orders }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    for (const { id, order } of orders) {
      await ctx.db.patch(id, { order, updatedAt: Date.now() });
    }
  },
});
```

### 3.2 — Create `convex/images.ts`

This file handles the 3-step image upload pipeline (upload URL → raw upload → Sharp conversion):

```ts
"use node"; // REQUIRED — Sharp needs Node.js runtime

import { action, query } from "./_generated/server";
import { v } from "convex/values";
import sharp from "sharp";

// ───────────────────────────────────────
// Step 1: Generate an upload URL
// ───────────────────────────────────────
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

// ───────────────────────────────────────
// Step 2 & 3: Convert uploaded image to WebP
// Called after the raw image is PUT to the upload URL.
// Reads raw bytes, converts to WebP via Sharp, stores WebP,
// deletes the raw original, returns the new storageId.
// ───────────────────────────────────────
export const convertToWebp = action({
  args: {
    rawStorageId: v.id("_storage"),
    quality: v.optional(v.number()),  // default 82
  },
  handler: async (ctx, { rawStorageId, quality = 82 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Read raw bytes from storage
    const blob = await ctx.storage.get(rawStorageId);
    if (!blob) throw new Error("File not found in storage");
    const arrayBuffer = await blob.arrayBuffer();

    // Convert to WebP
    const webpBuffer = await sharp(Buffer.from(arrayBuffer))
      .webp({ quality })
      .toBuffer();

    // Store WebP
    const webpBlob = new Blob([webpBuffer], { type: "image/webp" });
    const webpStorageId = await ctx.storage.store(webpBlob);

    // Delete the raw original to save storage
    await ctx.storage.delete(rawStorageId);

    return { storageId: webpStorageId };
  },
});

// ───────────────────────────────────────
// Public: Get URL for a storageId
// ───────────────────────────────────────
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
```

### 3.3 — Install Sharp

```bash
vp install sharp
```

**Important:** Sharp requires the Node.js runtime in Convex, hence the `"use node";` directive at the top of `convex/images.ts`. Make sure this directive is present or the deployment will fail.

### 3.4 — Understand the full upload flow

The frontend (admin form, built in Phase 11) will use this 3-step process:

```
1. Frontend calls generateUploadUrl mutation → gets a one-time PUT URL
2. Frontend PUT's the raw PNG/JPEG to that URL (using fetch with method: "POST", body: file)
   → Convex stores the raw file and returns a storageId
3. Frontend calls convertToWebp action with that rawStorageId
   → Action converts raw → WebP, stores WebP, deletes raw, returns webpStorageId
4. Frontend stores { storageId: webpStorageId, ar: "L" } in the project's images array
```

The frontend code for this is implemented in Phase 11c (image upload zones).

### 3.5 — Push functions to Convex

```bash
vp dlx convex dev
```

Verify in the Convex dashboard that all functions appear:
- `projects:list`, `projects:listByCategory`, `projects:getBySlug` (queries)
- `projects:create`, `projects:update`, `projects:remove`, `projects:reorder` (mutations)
- `images:generateUploadUrl`, `images:convertToWebp`, `images:getImageUrl`

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `convex/projects.ts` |
| CREATE | `convex/images.ts` |

---

## Validation Checklist

- [ ] `convex/projects.ts` has 3 public queries and 4 admin mutations
- [ ] All admin mutations check `ctx.auth.getUserIdentity()` and throw if null
- [ ] `convex/images.ts` has `generateUploadUrl` mutation, `convertToWebp` action, `getImageUrl` query
- [ ] `convex/images.ts` starts with `"use node";`
- [ ] `sharp` appears in `package.json` dependencies
- [ ] All functions appear in the Convex dashboard
- [ ] No deployment errors