import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
// Public: Get URL for a storageId
// ───────────────────────────────────────
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

// ───────────────────────────────────────
// Batch: Get URLs for multiple storage IDs
// Returns a map of storageId → url
// ───────────────────────────────────────
export const getImageUrls = query({
  args: { storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, { storageIds }) => {
    const results: Record<string, string | null> = {};
    for (const storageId of storageIds) {
      results[storageId] = await ctx.storage.getUrl(storageId);
    }
    return results;
  },
});

// ───────────────────────────────────────
// Step 3: Convert raw uploaded image to WebP via Sharp
// Runs in Node.js action context
// ───────────────────────────────────────
export const convertToWebp = mutation({
  args: {
    rawStorageId: v.id("_storage"),
    quality: v.optional(v.number()),
  },
  handler: async (ctx, { rawStorageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // For now: we simply return the same storageId.
    // The actual Sharp conversion requires a Node.js action (use node;" directive).
    // Since Convex actions with Sharp need special setup, we'll use the raw upload
    // as the final storageId. The images are stored as-is.
    // If Sharp/WebP conversion is needed later, this can be converted to an action.
    return { storageId: rawStorageId };
  },
});

// ───────────────────────────────────────
// Dedup: Find an existing image by its content hash
// Returns null if not found, or { storageId } if found.
// ───────────────────────────────────────
export const findByHash = mutation({
  args: { hash: v.string() },
  handler: async (ctx, { hash }) => {
    // Note: this is called as a mutation (not query) because we need
    // to invoke it imperatively from the upload hook. Mutations can
    // read data just like queries — the overhead is negligible.
    const existing = await ctx.db
      .query("imageHashes")
      .withIndex("by_hash", (q) => q.eq("hash", hash))
      .first();

    if (!existing) return null;
    return { storageId: existing.storageId };
  },
});

// ───────────────────────────────────────
// Dedup: Store a hash → storageId mapping after a new upload
// Handles race conditions: if hash was stored by a concurrent upload,
// returns the canonical storageId instead.
// ───────────────────────────────────────
export const storeHash = mutation({
  args: {
    hash: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { hash, storageId }) => {
    // Check if hash already exists (race-condition guard)
    const existing = await ctx.db
      .query("imageHashes")
      .withIndex("by_hash", (q) => q.eq("hash", hash))
      .first();

    if (existing) {
      // Another upload beat us — return its storageId.
      // The caller should use this canonical ID instead of its own.
      // (The duplicate file in storage is orphaned but harmless.)
      return existing.storageId;
    }

    await ctx.db.insert("imageHashes", {
      hash,
      storageId,
      createdAt: Date.now(),
    });

    return storageId;
  },
});

// ───────────────────────────────────────
// Delete an image from storage, its hash entry,
// and all references from projects that use it
// ───────────────────────────────────────
export const deleteImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Delete from storage
    await ctx.storage.delete(storageId);

    // Remove the hash entry so a future upload of the same file re-uploads it
    const hashEntry = await ctx.db
      .query("imageHashes")
      .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
      .first();
    if (hashEntry) {
      await ctx.db.delete(hashEntry._id);
    }

    // Remove references from all projects that use this image
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      const updatedImages = project.images.filter(
        (img) => img.storageId !== storageId,
      );
      if (updatedImages.length !== project.images.length) {
        await ctx.db.patch(project._id, {
          images: updatedImages,
          updatedAt: Date.now(),
        });
      }
    }
  },
});