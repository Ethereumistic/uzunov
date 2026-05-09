# Phase 05 — Migration Script: JSON → Convex

> **Prerequisite:** Phases 02 and 04 completed (schema pushed, slugify utility available).
> **Commit message suggestion:** `feat: add one-time migration from projects.json to Convex`

---

## Objective

Create an internal Convex mutation that seeds all 16 existing projects from `src/data/projects.json` into the Convex `projects` table. This is a one-time operation run from the Convex dashboard. After successful migration, existing CDN image URLs are preserved via the `url_legacy` field.

---

## Step-by-step

### 5.1 — Create `convex/migrations.ts`

**Important:** Convex functions run in the Convex cloud and cannot directly `import` from your `src/` directory (that's the frontend). The migration needs the project data embedded directly. We'll read the JSON data and inline it.

However, a cleaner approach is to pass the projects data as a JSON argument from the Convex dashboard when running the mutation. For simplicity, we'll create a helper that maps the existing JSON format to the new schema format:

```ts
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
        // Slug will be set from the existing `id` field (already URL-friendly)
        // or generate from title. The existing `id` fields like "office-kremi-gabrovo"
        // are already good slugs.
        slug: p.id,

        title_bg: p.title,
        title_en: p.title,  // placeholder — admin updates EN fields later
        description_bg: p.description ?? undefined,
        description_en: p.description ?? undefined,  // placeholder
        location_bg: p.location,
        location_en: p.location,  // placeholder
        investor_bg: p.investor,
        investor_en: p.investor,  // placeholder

        category: p.category,
        area: p.area ?? undefined,
        completionDate: p.completionDate ?? undefined,
        featured: p.featured ?? false,
        status: p.status,

        awards: (p.awards ?? []).map((a: string) => ({ text_bg: a, text_en: a })),

        // Migrate existing images: CDN URLs go to url_legacy, no storageId yet
        // Since storageId is required in the schema but we don't have Convex-stored images yet,
        // we use a temporary approach: store each image with a placeholder storageId
        // and the legacy URL.
        // 
        // PROBLEM: storageId is v.id("_storage") which is a real Convex storage ID.
        // We can't create a fake one. 
        // SOLUTION: Use url_legacy for all migrated images, and mark storageId 
        // with the Convex storage ID of the first image we'll need to handle specially.
        //
        // Actually, the best approach: upload CDN images to Convex storage during migration,
        // OR leave images empty for now and have the admin re-upload via the UI.
        //
        // RECOMMENDED: Store images with url_legacy only. The schema change we need:
        // Make storageId optional OR use a different image type for legacy.
        //
        // SIMPLEST: Add url_legacy to images as an optional field (already in schema).
        // For migrated projects, the image component falls back to url_legacy.
        // The storageId field must still exist for new uploads.
        //
        // We'll need a "dummy" storage approach. See note below.
        images: (p.images ?? []).map((img: any) => ({
          url_legacy: img.url,
          ar: img.ar,
        })),

        details: (p.details ?? []).map((d: any) => ({
          name_bg: d.name,
          name_en: d.name,  // placeholder
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
```

### 5.2 — Handle the `storageId` problem for migrated images

The schema defines images as:
```ts
images: v.array(v.object({
  storageId: v.id("_storage"),
  ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
  url_legacy: v.optional(v.string()),
}))
```

The `storageId` field is **required** (not optional), but migrated images only have CDN URLs. There are two clean solutions:

**Option A (Recommended):** Make `storageId` optional in the schema by changing it to `v.optional(v.id("_storage"))`. Then the image rendering component checks: if `storageId` exists, use Convex storage URL; if not, fall back to `url_legacy`.

**Option B:** During migration, fetch each CDN image, upload it to Convex storage, run it through the WebP conversion pipeline, and store the resulting `storageId`. This is more thorough but much more complex for a one-time script.

**Implement Option A.** Update the schema in `convex/schema.ts`:

```ts
images: v.array(v.object({
  storageId: v.optional(v.id("_storage")),  // ← CHANGED to optional
  ar: v.union(v.literal("L"), v.literal("S"), v.literal("V")),
  url_legacy: v.optional(v.string()),
})),
```

Also update `convex/projects.ts` mutations to reflect `storageId` as optional in the images type.

Then the migration can store:
```ts
images: (p.images ?? []).map((img: any) => ({
  url_legacy: img.url,
  ar: img.ar,
  // storageId is undefined — component will use url_legacy
})),
```

### 5.3 — Run the migration

1. Push the updated schema and migration function:
   ```bash
   vp dlx convex dev
   ```

2. In `src/data/projects.json`, copy the full JSON array contents.

3. Open the Convex dashboard → Functions → `migrations:seedFromJson` → Run with the projects array as the argument:
   ```json
   { "projects": [<paste the full projects.json array here>] }
   ```

4. Verify all 16 projects appear in the Convex dashboard under the `projects` table.

5. Confirm each project has:
   - A valid slug (same as the old `id` field)
   - All `_bg` fields populated, `_en` fields populated with BG values as placeholders
   - Images with `url_legacy` pointing to CDN URLs (or local paths like `/ai1.webp`)
   - `storageId` left undefined for legacy images

### 5.4 — Handle local image references

Some projects reference local images like `/ai1.webp`, `/ai2.webp`, `/ai3.webp` (which are in the `public/` folder). These need to be converted to full URLs for the Convex-hosted site to serve them.

For local images, in the migration argument, replace:
- `/ai1.webp` → Use the full public URL of the site (e.g., `https://your-domain.com/ai1.webp`)

Or better: manually upload these 3 local WebP files to Convex storage through the admin UI once it's built (Phase 11), and update the projects to use `storageId` instead of `url_legacy`.

**For now**, during migration, prepend the site URL to local paths so the rendering component works:
```
/ai1.webp → https://projekti.uzunov.bg/ai1.webp
```

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `convex/migrations.ts` |
| EDIT | `convex/schema.ts` (make `storageId` optional) |
| EDIT | `convex/projects.ts` (update image type in mutation args) |

---

## Validation Checklist

- [ ] `storageId` is `v.optional(v.id("_storage"))` in the schema
- [ ] `convex/migrations.ts` exists with `seedFromJson` internal mutation
- [ ] All 16 projects appear in Convex dashboard after migration
- [ ] Each project has a `slug` matching the original `id`
- [ ] `_bg` fields are populated; `_en` fields have BG placeholders
- [ ] Images have `url_legacy` populated for CDN/local URLs
- [ ] `featured`, `status`, `category`, `order` fields are correct
- [ ] No duplicate projects (migration is idempotent — checks for existing data)