import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  projects: defineTable({
    // ── Slug (URL-friendly, unique, auto-generated from BG title) ──
    slug: v.string(),

    // ── Bilingual fields ──
    title_bg: v.string(),
    title_en: v.string(),
    description_bg: v.optional(v.string()),
    description_en: v.optional(v.string()),
    location_bg: v.string(),
    location_en: v.string(),
    investor_bg: v.string(),
    investor_en: v.string(),

    // ── Language-neutral fields ──
    category: v.union(
      v.literal("Office"),
      v.literal("Healthcare"),
      v.literal("Commercial"),
      v.literal("Industrial"),
      v.literal("Residential"),
      v.literal("Interior"),
    ),
    area: v.optional(v.number()),
    completionDate: v.optional(v.string()),  // ISO date string "YYYY-MM-DD"
    featured: v.boolean(),
    status: v.union(v.literal("done"), v.literal("in-progress")),

    // ── Awards (bilingual array) ──
    awards: v.array(v.object({
      text_bg: v.string(),
      text_en: v.string(),
    })),

    // ── Images (stored in Convex File Storage) ──
    images: v.array(v.object({
      storageId: v.optional(v.id("_storage")),
      ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
      url_legacy: v.optional(v.string()),  // CDN fallback for migrated images
    })),

    // ── Sub-buildings / details (bilingual name) ──
    details: v.optional(v.array(v.object({
      name_bg: v.string(),
      name_en: v.string(),
      area: v.number(),
    }))),

    // ── Ordering ──
    order: v.number(),

    // ── Timestamps ──
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_order", ["order"])
    .index("by_category_order", ["category", "order"]),

  // ── Content-hash → storageId mapping for image deduplication ──
  imageHashes: defineTable({
    hash: v.string(),                     // SHA-256 hex digest of file bytes
    storageId: v.id("_storage"),          // The stored image this hash maps to
    createdAt: v.number(),
  })
    .index("by_hash", ["hash"])
    .index("by_storageId", ["storageId"]),

  // ── Blog posts ──
  posts: defineTable({
    slug: v.string(),
    title_bg: v.string(),
    title_en: v.optional(v.string()),
    body_bg: v.string(),              // Rich text (HTML) in Bulgarian
    body_en: v.optional(v.string()),  // Rich text (HTML) in English
    excerpt_bg: v.optional(v.string()), // Short summary for cards
    excerpt_en: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")), // Main/cover image
    images: v.array(v.object({
      storageId: v.optional(v.id("_storage")),
      url_legacy: v.optional(v.string()),
    })),
    published: v.boolean(),         // Draft vs Published
    displayDate: v.string(),          // Admin-set display date "YYYY-MM-DD"
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_order", ["order"])
    .index("by_displayDate", ["displayDate"]),
});