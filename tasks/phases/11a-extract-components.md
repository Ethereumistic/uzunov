# Phase 11a — Extract Shared Components from `$projectId.tsx`

> **Prerequisite:** Phase 06 completed (public routes using Convex).
> **Commit message suggestion:** `refactor: extract ProjectDetailView, MainCarousel, ProjectBentoGrid, ProjectImage into shared components`

---

## Objective

Extract the reusable components from `src/routes/projects/$slug.tsx` into `src/components/projects/` so they can be shared between the public project detail page and the admin live preview. This is required before building the WYSIWYG editor.

---

## Step-by-step

### 11a.1 — Create the component directory

```
src/components/projects/
├── ProjectDetailView.tsx    ← Full layout, accepts a Project prop + locale
├── MainCarousel.tsx         ← Extracted from $slug.tsx
├── ProjectBentoGrid.tsx     ← Extracted from $slug.tsx
├── ProjectDetailCard.tsx    ← Right-side info card (details, awards, etc.)
└── ProjectImage.tsx         ← Created in Phase 06 (already exists)
```

### 11a.2 — Define the shared Project type

Create `src/types/project.ts` to define the TypeScript type that both public and admin pages use:

```ts
export type ProjectCategory = "Office" | "Healthcare" | "Commercial" | "Industrial" | "Residential" | "Interior";
export type ProjectStatus = "done" | "in-progress";
export type ImageAR = "L" | "S" | "V";

export interface ProjectImage {
  storageId?: string;   // Convex storage ID (optional for legacy)
  ar: ImageAR;
  url_legacy?: string;  // CDN fallback
}

export interface ProjectAward {
  text_bg: string;
  text_en: string;
}

export interface ProjectDetail {
  name_bg: string;
  name_en: string;
  area: number;
}

export interface Project {
  _id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  description_bg?: string;
  description_en?: string;
  location_bg: string;
  location_en: string;
  investor_bg: string;
  investor_en: string;
  category: ProjectCategory;
  area?: number;
  completionDate?: string;
  featured: boolean;
  status: ProjectStatus;
  awards: ProjectAward[];
  images: ProjectImage[];
  details?: ProjectDetail[];
  order: number;
  createdAt: number;
  updatedAt: number;
}
```

Alternatively, import `Doc<"projects">` from Convex generated types and use that. The advantage of a shared type is that the admin form can construct mock Project objects without hitting Convex.

### 11a.3 — Extract `MainCarousel.tsx`

Move the `MainCarousel` function from `$slug.tsx` into its own file. It should accept typed props:

```tsx
// src/components/projects/MainCarousel.tsx
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MainCarouselProps {
  images: Array<{ url: string; ar?: string }>;
  onImageClick?: (index: number) => void;
}

export function MainCarousel({ images, onImageClick }: MainCarouselProps) {
  // ... (same logic as in $slug.tsx, but with props)
}
```

The `onImageClick` callback opens the lightbox. For the admin preview, it can be a no-op.

### 11a.4 — Extract `ProjectBentoGrid.tsx`

```tsx
// src/components/projects/ProjectBentoGrid.tsx
interface ProjectBentoGridProps {
  images: Array<{ url: string; ar: "L" | "S" | "V" }>;
  onImageClick?: (index: number) => void;
  maxImages?: number;
}

export function ProjectBentoGrid({ images, onImageClick, maxImages = 9 }: ProjectBentoGridProps) {
  // ... (same bento grid logic)
}
```

Export the `buildBentoSpecs` helper as well if it's needed elsewhere.

### 11a.5 — Extract `ProjectDetailCard.tsx`

This is the right-side glass card with project metadata (location, area, investor, etc.):

```tsx
// src/components/projects/ProjectDetailCard.tsx
interface ProjectDetailCardProps {
  project: Project;
  locale: "bg" | "en";
}

export function ProjectDetailCard({ project, locale }: ProjectDetailCardProps) {
  const t = locale === "bg" ? {
    location: project.location_bg,
    investor: project.investor_bg,
    // ... etc
  } : {
    location: project.location_en,
    investor: project.investor_en,
    // ...
  };
  // ... (render the card)
}
```

### 11a.6 — Create `ProjectDetailView.tsx`

This is the top-level component that composes the carousel, bento grid, and detail card:

```tsx
// src/components/projects/ProjectDetailView.tsx
interface ProjectDetailViewProps {
  project: Project;
  locale: "bg" | "en";
}

export function ProjectDetailView({ project, locale }: ProjectDetailViewProps) {
  // Resolves images to URLs (storageId → Convex URL, or url_legacy)
  // Renders MainCarousel, ProjectBentoGrid, ProjectDetailCard
  // Handles lightbox state
}
```

### 11a.7 — Refactor `$slug.tsx` to use shared components

The public page becomes simple:

```tsx
// src/routes/projects/$slug.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ProjectDetailView } from "#/components/projects/ProjectDetailView";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = useQuery(api.projects.getBySlug, { slug });

  if (project === undefined) {
    return <div>Loading…</div>;
  }

  if (project === null) {
    return <div>Project not found</div>;
  }

  return <ProjectDetailView project={project} locale="bg" />;
}
```

### 11a.8 — Image URL resolution helper

Create a utility hook/utility for resolving image URLs:

```tsx
// src/hooks/useProjectImages.ts
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { ProjectImage } from "#/types/project";

export function useImageUrl(storageId: string | undefined): string | undefined {
  const url = useQuery(
    storageId ? api.images.getImageUrl : "skip",
    storageId ? { storageId: storageId as any } : "skip"
  );
  return url;
}

export function resolveImageUrl(image: ProjectImage): string {
  // This is a synchronous helper for when we have url_legacy but no storageId
  // For storageId-based images, the component must use the hook above
  return image.url_legacy ?? "";
}
```

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/types/project.ts` |
| CREATE | `src/components/projects/ProjectDetailView.tsx` |
| CREATE | `src/components/projects/MainCarousel.tsx` |
| CREATE | `src/components/projects/ProjectBentoGrid.tsx` |
| CREATE | `src/components/projects/ProjectDetailCard.tsx` |
| CREATE | `src/hooks/useProjectImages.ts` |
| EDIT | `src/routes/projects/$slug.tsx` (simplified to use shared components) |

---

## Validation Checklist

- [ ] Public project detail page (`/projects/{slug}`) works identically after refactoring
- [ ] `ProjectDetailView` accepts a `project` prop and `locale` prop
- [ ] `MainCarousel`, `ProjectBentoGrid`, `ProjectDetailCard` are independent components
- [ ] Image rendering works for both `storageId` and `url_legacy` sources
- [ ] Lightbox still works
- [ ] No visual regression on the public project page