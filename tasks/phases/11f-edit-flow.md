# Phase 11f — Admin Editor: Edit Flow (Pre-populate from Existing Project)

> **Prerequisite:** Phase 11e completed (end-to-end create → view verified).
> **Commit message suggestion:** `feat: add edit flow with pre-populated form for existing projects`

---

## Objective

Implement the `/admin/projects/$projectId/edit` route that loads an existing project from Convex and pre-populates the editor form. The edit form shares most logic with the create form, so we extract a shared `ProjectEditor` component.

---

## Step-by-step

### 11f.1 — Extract `ProjectEditor` into a shared component

Create `src/components/admin/ProjectEditor.tsx` that contains all the form logic currently in `new.tsx`. It accepts optional `initialData` prop:

```tsx
interface ProjectEditorProps {
  initialData?: Project | null;  // null = creating new, Project = editing existing
  projectId?: Id<"projects">;   // Convex ID for update mutation
}

export function ProjectEditor({ initialData, projectId }: ProjectEditorProps) {
  const isEditing = !!initialData;

  // Initialize form state from initialData or empty state
  const [form, setForm] = useState<ProjectFormState>(() => {
    if (initialData) {
      return projectToForm(initialData);
    }
    return emptyFormState;
  });

  // ... rest of form logic (same as new.tsx but using create vs update mutation)
}
```

### 11f.2 — Create `projectToForm` converter

`src/lib/projectToForm.ts`:

```ts
import type { Project } from "#/types/project";
import type { ProjectFormState } from "#/types/project-form";
import { emptyFormState } from "#/types/project-form";

export function projectToForm(project: Project): ProjectFormState {
  return {
    slug: project.slug,
    title_bg: project.title_bg,
    title_en: project.title_en,
    description_bg: project.description_bg ?? "",
    description_en: project.description_en ?? "",
    location_bg: project.location_bg,
    location_en: project.location_en,
    investor_bg: project.investor_bg,
    investor_en: project.investor_en,
    category: project.category,
    area: project.area?.toString() ?? "",
    completionDate: project.completionDate ?? "",
    featured: project.featured,
    status: project.status,
    awards: project.awards.map((a) => ({ text_bg: a.text_bg, text_en: a.text_en })),
    details: project.details?.map((d) => ({
      name_bg: d.name_bg,
      name_en: d.name_en,
      area: d.area.toString(),
    })) ?? [],
    images: project.images.map((img) => ({
      storageId: img.storageId,
      ar: img.ar,
      url_legacy: img.url_legacy,
    })),
  };
}
```

### 11f.3 — Implement the edit page

`src/routes/admin/projects/$projectId/edit.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { ProjectEditor } from "#/components/admin/ProjectEditor";

export const Route = createFileRoute("/admin/projects/$projectId/edit")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { projectId } = Route.useParams();
  const project = useQuery(api.projects.getById, { id: projectId as any });

  if (project === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  if (project === null) {
    return <div className="p-6">Project not found</div>;
  }

  return <ProjectEditor initialData={project} projectId={project._id} />;
}
```

### 11f.4 — Handle update mutation in `ProjectEditor`

When editing, the save handler uses `api.projects.update` instead of `api.projects.create`:

```tsx
const createProject = useMutation(api.projects.create);
const updateProject = useMutation(api.projects.update);

const handleSave = async (publish: boolean) => {
  // ... validation ...

  const payload = {
    ...form,
    area: form.area ? parseFloat(form.area) : undefined,
    completionDate: form.completionDate || undefined,
    details: form.details.map((d) => ({
      ...d,
      area: parseFloat(d.area),
    })),
    images: form.images.filter((img) => img.storageId),
  };

  if (isEditing && projectId) {
    await updateProject({ id: projectId, ...payload });
  } else {
    await createProject(payload);
  }

  navigate({ to: "/admin/projects" });
};
```

### 11f.5 — Handle header text and navigation

The editor header should show:
- **Creating:** "New Project"
- **Editing:** "Edit: {project.title_bg}"

The back button should:
- **Creating:** Navigate to `/admin/projects`
- **Editing:** Navigate to `/admin/projects` (same)

### 11f.6 — Simplify `new.tsx`

`src/routes/admin/projects/new.tsx` becomes a thin wrapper:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProjectEditor } from "#/components/admin/ProjectEditor";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  return <ProjectEditor />;
}
```

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/components/admin/ProjectEditor.tsx` (shared editor component) |
| CREATE | `src/lib/projectToForm.ts` |
| EDIT | `src/routes/admin/projects/new.tsx` (thin wrapper) |
| EDIT | `src/routes/admin/projects/$projectId/edit.tsx` (load project + pass to editor) |

---

## Validation Checklist

- [ ] `/admin/projects/new` still works for creating new projects
- [ ] `/admin/projects/{id}/edit` loads the existing project data
- [ ] All form fields are pre-populated correctly (BG + EN fields)
- [ ] Existing images are displayed with AR badges
- [ ] Editing and saving calls the update mutation
- [ ] Slug field is pre-populated but editable
- [ ] Language tabs work correctly in edit mode
- [ ] Live preview renders the existing project data
- [ ] "Save Draft" and "Publish" both save changes correctly
- [ ] After saving, redirect to `/admin/projects` and the table shows updated data