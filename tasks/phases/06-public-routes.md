# Phase 06 — Update Public Website: Switch from JSON to Convex

> **Prerequisite:** Phase 05 completed (all 16 projects seeded in Convex).
> **Commit message suggestion:** `feat: switch public site from static JSON to Convex live queries`

---

## Objective

Replace all static imports from `src/data/projects.ts` with live Convex queries. Change the project detail route from `$projectId` to `$slug`. Update `ProjectCard` links to use slugs. The public site now reads from the Convex database in real-time.

---

## Step-by-step

### 6.1 — Update the route: `$projectId` → `$slug`

Rename `src/routes/projects/$projectId.tsx` to `src/routes/projects/$slug.tsx`.

Update the route definition inside the file:

```tsx
// Before:
export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
});

// After:
export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
});
```

### 6.2 — Update `$slug.tsx` to use Convex query

Replace the static `getProjectById(projectId)` call with:

```tsx
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = useQuery(api.projects.getBySlug, { slug });
  // ...
}
```

**Key changes:**
- Replace `getProjectById(projectId)` with `useQuery(api.projects.getBySlug, { slug })`
- `project` will be `undefined` while loading, `null` if not found, or the project object
- Handle loading state: show a spinner/skeleton
- Handle null state: show "project not found"

### 6.3 — Update project field references

The project object from Convex has different field names than the old JSON format. Update all references:

| Old (JSON) | New (Convex) | Notes |
|------------|-------------|-------|
| `project.id` | `project.slug` | Slugs are the new identifier |
| `project.title` | `project.title_bg` | Use `_bg` for the Bulgarian site |
| `project.description` | `project.description_bg` | Use `_bg` suffix |
| `project.location` | `project.location_bg` | Use `_bg` suffix |
| `project.investor` | `project.investor_bg` | Use `_bg` suffix |
| `project.images[i].url` | See below | Image rendering changes |
| `project.details[i].name` | `project.details[i].name_bg` | Use `_bg` suffix |

### 6.4 — Create `src/components/projects/ProjectImage.tsx`

This component handles the dual image source (Convex storage vs. legacy CDN):

```tsx
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ProjectImageProps {
  image: {
    storageId?: string;  // Convex storage ID (optional for legacy images)
    ar: "L" | "S" | "V";
    url_legacy?: string;  // CDN fallback
  };
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function ProjectImage({ image, alt, className, onClick }: ProjectImageProps) {
  // If we have a storageId, fetch the Convex URL
  const imageUrl = useQuery(
    image.storageId ? api.images.getImageUrl : "skip",
    image.storageId ? { storageId: image.storageId as any } : "skip"
  );

  // Priority: Convex storage URL → legacy CDN URL → placeholder
  const src = imageUrl ?? image.url_legacy ?? "";

  if (!src) {
    return (
      <div className={`${className} bg-stone-100 flex items-center justify-center`}>
        <span className="text-5xl opacity-10">◻</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
}
```

**Note on the `"skip"` pattern:** When `image.storageId` is undefined (legacy images), we still need to pass something to `useQuery` to avoid the hook. The cleaner pattern is:

```tsx
const imageUrl = image.storageId
  ? useQuery(api.images.getImageUrl, { storageId: image.storageId as any })
  : null;
const src = imageUrl ?? image.url_legacy ?? "";
```

However, hooks can't be called conditionally. So use the `useQuery` with a conditional pattern, or simply resolve to `url_legacy` when no `storageId` exists.

### 6.5 — Update `src/routes/projects/index.tsx`

Replace static imports with Convex queries:

```tsx
// Remove these imports:
// import { projects, allCategories, categoryLabels, type ProjectCategory } from "#/data/projects"

// Add these imports:
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function ProjectsPage() {
  const projects = useQuery(api.projects.list) ?? [];
  // ...
}
```

Add a loading state:
```tsx
if (projects === undefined) {
  return <div>Loading projects...</div>;  // Or a skeleton/spinner
}
```

Since `categoryLabels` and `allCategories` are static config (not data), keep them as constants in the component or a shared file — they don't need Convex.

### 6.6 — Update `ProjectCard` to use slugs

In `src/components/projects/ProjectCard.tsx`:

```tsx
// Before:
<Link to="/projects/$projectId" params={{ projectId: project.id }}>

// After:
<Link to="/projects/$slug" params={{ slug: project.slug }}>
```

Also update the `ProjectCard` TypeScript interface to match the new Convex project shape. The `project` prop will now be of type `Doc<"projects">` from Convex instead of the old `Project` type from `data/projects.ts`.

### 6.7 — Update `OtherProjectsSection` component

If `OtherProjectsSection` in `src/components/sections/OtherProjectsSection.tsx` imports from `data/projects.ts`, update it to accept projects as a prop or use Convex queries.

### 6.8 — Update `ProjectDetailView` field references

In the extracted `$slug.tsx` component (and later in `ProjectDetailView.tsx`), all field references must use `_bg` suffixes for the Bulgarian site. For example:

- `project.title` → `project.title_bg`
- `project.description` → `project.description_bg`
- `project.location` → `project.location_bg`
- `project.investor` → `project.investor_bg`
- `project.awards[i].text` → `project.awards[i].text_bg`
- `project.details[i].name` → `project.details[i].name_bg`

### 6.9 — Keep `src/data/projects.ts` and `projects.json` for reference

Don't delete these files yet — they're needed for the migration (Phase 05) and as a reference. They can be cleaned up after confirming the migration was successful.

---

## Key Behavioral Changes

| Before | After |
|--------|-------|
| URLs like `/projects/office-kremi-gabrovo` | Same URLs (since `slug` = old `id`), but served from `$slug` route |
| Static JSON import | Live Convex query |
| `project.id` used in links | `project.slug` used in links |
| Images via `url` property | Images via `storageId` (Convex storage) or `url_legacy` (CDN fallback) |
| Instant rendering | Brief loading state while Convex fetches data |

---

## Files Touched

| Action | Path |
|--------|------|
| RENAME | `src/routes/projects/$projectId.tsx` → `src/routes/projects/$slug.tsx` |
| EDIT | `src/routes/projects/$slug.tsx` (use Convex query, `_bg` fields) |
| EDIT | `src/routes/projects/index.tsx` (use Convex query) |
| EDIT | `src/components/projects/ProjectCard.tsx` (slug links, new types) |
| EDIT | `src/components/sections/OtherProjectsSection.tsx` (if needed) |
| CREATE | `src/components/projects/ProjectImage.tsx` |

---

## Validation Checklist

- [ ] `/projects` page loads and displays all 16 projects from Convex
- [ ] Clicking a project card navigates to `/projects/{slug}` (not `/projects/{id}`)
- [ ] Project detail page loads with Convex data
- [ ] Loading states are visible while data fetches
- [ ] "Project not found" page works for invalid slugs
- [ ] Images render — Convex storage images and CDN legacy URLs both work
- [ ] All `_bg` fields display correctly on the Bulgarian site
- [ ] Category filtering still works on `/projects` page