# Phase 12 — i18n Compatibility Notes & Future Work

> **Prerequisite:** All previous phases completed.
> **Commit message suggestion:** `docs: add i18n compatibility notes`

---

## Objective

Document the i18n readiness of the project schema and note what's needed for future internationalization. This phase does not require code changes — it's purely documentation for the next iteration.

---

## i18n Readiness

The project schema was designed to be i18n-ready from day one:

### How bilingual fields work

- All user-facing text has `_bg` and `_en` suffixes
- The `locale` prop on `ProjectDetailView` picks the right field:
  ```tsx
  const title = locale === "bg" ? project.title_bg : project.title_en;
  ```
- Slugs are language-neutral (always from BG title), so URLs don't change between languages
- The Convex `getBySlug` query returns the full document — the component does field selection

### Language-neutral fields

These fields are shared across all languages:
- `slug`, `category`, `area`, `status`, `featured`, `completionDate`, `order`, `images`

### What's needed for full i18n

1. **Router-level locale prefix:** Add `/en/` and `/bg/` (or default) to the URL structure
   - `/projects/office-kremi-gabrovo` → Bulgarian (default)
   - `/en/projects/office-kremi-gabrovo` → English

2. **Locale context:** Create a `LocaleProvider` that provides the current language
   ```tsx
   const LocaleContext = createContext<"bg" | "en">("bg");
   ```

3. **Admin form:** Already has language tabs — no changes needed

4. **Public site:** Replace hardcoded `_bg` field access with locale-aware access:
   ```tsx
   // Before:
   project.title_bg
   
   // After:
   const t = useLocale(); // "bg" or "en"
   project[`title_${t}`] as string;
   ```

5. **Category labels:** Already defined with BG names. Add EN names:
   ```ts
   const categoryLabels = {
     bg: { All: "Всички", Office: "Офиси", ... },
     en: { All: "All", Office: "Offices", ... },
   };
   ```

6. **SEO:** Add `hreflang` alternate links for each page

---

## Future Enhancements (Not in Scope)

These are potential next steps after the core admin panel is complete:

| Feature | Description |
|---------|-------------|
| Drag-to-reorder projects | Add drag-and-drop to the admin projects list to update the `order` field |
| Bulk image upload | Upload multiple images at once (currently one at a time) |
| Image cropping | Add an image cropper tool before uploading |
| Rich text description | Replace plain textarea with a WYSIWYG editor for descriptions |
| Role-based access | Add admin roles (editor vs super admin) |
| Audit log | Track who made changes and when |
| Version history | Store previous versions of project data |
| Auto-save drafts | Save form state to localStorage periodically |
| Dashboard stats | Project count, image count, storage usage on admin home |
| Full i18n routing | Implement `/en/` prefix routing for the public site |

---

## Cleanup After Migration

Once the migration is complete and all 16 projects are verified in Convex:

1. **Delete `src/data/projects.json`** (or move to `src/data/projects.json.bak` for backup)
2. **Delete `src/data/projects.ts`** (the TypeScript interface and helpers are replaced by Convex types)
3. **Delete `src/data/projects.jsony`** (backup file)
4. **Delete `src/data/demo-table-data.ts`** (demo data)
5. **Remove demo routes:** `src/routes/demo/` directory
6. **Delete `convex/migrations.ts`** (one-time script, no longer needed)
7. **Remove `src/routes/demo/`** from the route tree
8. **Clean up dead imports** that reference the old `data/projects.ts`

---

## Validation Checklist

- [ ] All documentation is up to date
- [ ] i18n approach is documented
- [ ] Cleanup tasks are noted for post-migration
- [ ] No code changes required in this phase