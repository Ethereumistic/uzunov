# Phase 02 — Convex Schema (Projects)

> **Prerequisite:** Phase 01 completed (auth tables present in Convex).
> **Commit message suggestion:** `feat: define full projects schema in Convex`

---

## Objective

Define the complete `projects` table schema in Convex. This is the data model that powers both the public-facing website and the admin CMS.

---

## Step-by-step

### 2.1 — Replace `convex/schema.ts` with full schema

```ts
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
      storageId: v.id("_storage"),
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
    .index("by_featured", ["featured"]),
});
```

**Key design decisions:**

- **`url_legacy`** in images: This optional field stores the old CDN URL from `cdn.jsdelivr.net` during migration (Phase 05). New uploads will always use `storageId`. The rendering component checks `storageId` first, falls back to `url_legacy`.
- **Bilingual fields**: All user-facing text has `_bg` and `_en` suffixes. Language-neutral fields (category, area, status, etc.) are shared.
- **`slug`**: URL-friendly, unique identifier auto-generated from the Bulgarian title (via the `slugify` utility in Phase 04), but manually editable in the admin form.
- **`order`**: Integer for manual reordering (drag-and-drop in admin later).

### 2.2 — Push schema to Convex

```bash
vp dlx convex dev
```

Verify in the Convex dashboard that the `projects` table appears with all fields and indexes (`by_slug`, `by_category`, `by_featured`).

---

## Files Touched

| Action | Path |
|--------|------|
| EDIT | `convex/schema.ts` |

---

## Validation Checklist

- [ ] `convex/schema.ts` contains both `authTables` and the `projects` table
- [ ] Convex dashboard shows the `projects` table with correct fields
- [ ] Three indexes exist: `by_slug`, `by_category`, `by_featured`
- [ ] `slug` field is `v.string()` (unique by application logic, not Convex-level unique index)
- [ ] `url_legacy` is `v.optional(v.string())` in images
- [ ] App still starts without errors