# Phase 11d — Admin Editor: Live Preview

> **Prerequisite:** Phase 11c completed (image upload working).
> **Commit message suggestion:** `feat: add split-pane live preview to admin project editor`

---

## Objective

Add a live preview pane to the right side of the admin editor. The preview renders the `ProjectDetailView` component (extracted in Phase 11a) using the form state as input, reflecting changes in real-time. The preview uses CSS scaling to fit the full-width layout into the 50% pane.

---

## Step-by-step

### 11d.1 — Create the form-state-to-project converter

The `ProjectDetailView` component expects a full `Project` object. We need a function that converts the form state (with string areas, etc.) into the shape `ProjectDetailView` expects.

`src/lib/formToProject.ts`:

```ts
import type { ProjectFormState } from "#/types/project-form";
import type { Project } from "#/types/project";

/**
 * Convert form state to a Project-like object for the live preview.
 * Form uses strings for area/number fields; the preview needs numbers.
 */
export function formToProject(
  form: ProjectFormState,
  locale: "bg" | "en"
): Project {
  return {
    _id: "preview",
    slug: form.slug,
    title_bg: form.title_bg,
    title_en: form.title_en,
    description_bg: form.description_bg || undefined,
    description_en: form.description_en || undefined,
    location_bg: form.location_bg,
    location_en: form.location_en,
    investor_bg: form.investor_bg,
    investor_en: form.investor_en,
    category: form.category,
    area: form.area ? parseFloat(form.area) : undefined,
    completionDate: form.completionDate || undefined,
    featured: form.featured,
    status: form.status,
    awards: form.awards,
    details: form.details.map((d) => ({
      name_bg: d.name_bg,
      name_en: d.name_en,
      area: parseFloat(d.area) || 0,
    })),
    images: form.images.map((img) => ({
      storageId: img.storageId,
      ar: img.ar,
      url_legacy: img.url_legacy,
    })),
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
```

### 11d.2 — Create the preview pane component

`src/components/admin/ProjectPreview.tsx`:

```tsx
import { useMemo } from "react";
import type { Project } from "#/types/project";
import { ProjectDetailView } from "#/components/projects/ProjectDetailView";
import type { ProjectFormState } from "#/types/project-form";
import { formToProject } from "#/lib/formToProject";

interface ProjectPreviewProps {
  form: ProjectFormState;
  locale: "bg" | "en";
}

export function ProjectPreview({ form, locale }: ProjectPreviewProps) {
  const project = useMemo(() => formToProject(form, locale), [form, locale]);

  return (
    <div className="w-[166%] scale-[0.6] origin-top-left">
      <ProjectDetailView project={project} locale={locale} />
    </div>
  );
}
```

**The CSS scale trick:** The preview pane is 50% of the screen width. The `ProjectDetailView` is designed for full-width (100%). Using `scale-[0.6]` with `w-[166%]` (= 1/0.6), the preview appears at approximately 60% scale, fitting into the right pane while maintaining the full-width layout structure.

### 11d.3 — Update the editor layout to split-pane

Modify `src/routes/admin/projects/new.tsx` to use a split-pane layout:

```tsx
// Change the return JSX structure from a single column to a split pane:

return (
  <div className="flex h-[calc(100vh-4rem)]">
    {/* Left: Editor (50%) */}
    <div className="w-1/2 overflow-y-auto p-6 border-r border-stone-200">
      {/* ... all form fields ... */}
    </div>

    {/* Right: Live Preview (50%) */}
    <div className="w-1/2 overflow-hidden bg-stone-50">
      <div className="p-4">
        <h3 className="text-sm font-medium text-stone-500 mb-2">Live Preview ({locale === "bg" ? "БГ" : "EN"})</h3>
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {form.title_bg ? (
            <ProjectPreview form={form} locale={locale} />
          ) : (
            <div className="flex items-center justify-center h-64 text-stone-400">
              Start filling in the form to see a preview
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
```

### 11d.4 — Handle the preview's image resolution

`ProjectDetailView` → `MainCarousel` and `ProjectBentoGrid` need image URLs. For new uploads that only have `storageId`, the `ProjectImage` component uses `useQuery(api.images.getImageUrl)` to resolve them. For legacy images with `url_legacy`, the URL is used directly.

Since `ProjectPreview` uses the shared `ProjectDetailView`, and `ProjectDetailView` uses `ProjectImage` for rendering, the image resolution should work automatically as long as `ProjectImage` is set up correctly (from Phase 11a/06).

**Important:** The `useQuery` hook inside `ProjectImage` only works when the form images have valid `storageId` values. During the form (before save), images uploaded through the UI will have `storageId`s. Make sure the preview doesn't crash if images are empty.

### 11d.5 — The language tab drives the preview

The active language tab (BG/EN) drives both:
1. Which form fields are shown in the editor
2. Which language the preview uses

When you switch the tab from BG → EN, the preview switches to English fields.

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/lib/formToProject.ts` |
| CREATE | `src/components/admin/ProjectPreview.tsx` |
| EDIT | `src/routes/admin/projects/new.tsx` (split-pane layout + preview) |

---

## Validation Checklist

- [ ] Editor shows as left panel (50% width) with form fields
- [ ] Preview shows as right panel (50% width) with live rendering
- [ ] Changing form fields immediately updates the preview
- [ ] Language tab switch updates both editor fields and preview language
- [ ] Preview shows the project detail layout (carousel, bento grid, detail card)
- [ ] Images uploaded in the form appear in the preview
- [ ] CSS scaling makes the full-width layout fit the 50% preview pane
- [ ] Empty form state shows a placeholder message in the preview area