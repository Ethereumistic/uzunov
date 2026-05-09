# Phase 10 — Admin Projects List Table

> **Prerequisite:** Phase 09 completed (sidebar + layout).
> **Commit message suggestion:** `feat: build admin projects list table`

---

## Objective

Build the `/admin/projects` page — a data table showing all projects with thumbnail, title, category, status, and action buttons (edit, delete). Includes a "New Project" button that navigates to the creation form.

---

## Step-by-step

### 10.1 — Install ShadCN Table component

```bash
vp dlx shadcn@latest add table
vp dlx shadcn@latest add dialog
vp dlx shadcn@latest add dropdown-menu
vp dlx shadcn@latest add badge
```

### 10.2 — Implement `src/routes/admin/projects/index.tsx`

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Id } from "../../../../../convex/_generated/dataModel";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage,
});

const categoryLabels: Record<string, string> = {
  Office: "Офис",
  Healthcare: "Здравеопазване",
  Commercial: "Търговски",
  Industrial: "Индустриален",
  Residential: "Жилищен",
  Interior: "Интериор",
};

function AdminProjectsPage() {
  const projects = useQuery(api.projects.list);
  const removeProject = useMutation(api.projects.remove);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"projects">;
    title: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeProject({ id: deleteTarget.id });
    setDeleteTarget(null);
  };

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Projects</h1>
        <Link to="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Img</TableHead>
              <TableHead>Title (BG)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>
                  {/* Thumbnail: use url_legacy or Convex storage URL */}
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0].url_legacy ?? ""}
                      alt={project.title_bg}
                      className="h-10 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-16 bg-stone-100 rounded flex items-center justify-center text-stone-300">
                      ◻
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {project.title_bg}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {categoryLabels[project.category] ?? project.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === "done" ? "default" : "outline"}>
                    {project.status === "done" ? "Завършен" : "В процес"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to="/admin/projects/$projectId/edit" params={{ projectId: project._id }}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        setDeleteTarget({ id: project._id, title: project.title_bg })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### 10.3 — Note on edit link parameter

The edit route uses `$projectId` (which is a Convex document ID, like `projects:abc123`). This is different from the public route which uses `$slug`. The admin edit links use the internal `_id` for direct lookup.

You may need to add a Convex query for getting a project by `_id` (Convex already supports this via `ctx.db.get(id)`). If not already in `convex/projects.ts`, add:

```ts
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
```

### 10.4 — Image thumbnail handling

For the table row thumbnail, we have two options:
- **Legacy images:** Use `url_legacy` directly (works for CDN URLs)
- **New images (with storageId):** Need to fetch the URL via Convex

For the list table, use `url_legacy` as a quick fallback. For a more robust approach, create a small hook or component that resolves `storageId` → URL. This is handled by `ProjectImage.tsx` (created in Phase 06).

---

## Files Touched

| Action | Path |
|--------|------|
| EDIT | `src/routes/admin/projects/index.tsx` (full implementation) |
| EDIT | `convex/projects.ts` (add `getById` query if missing) |

---

## Validation Checklist

- [ ] `/admin/projects` shows a table of all 16 projects
- [ ] Each row shows a thumbnail (via `url_legacy`), title, category badge, status badge
- [ ] "New Project" button navigates to `/admin/projects/new`
- [ ] Edit icon navigates to `/admin/projects/{id}/edit`
- [ ] Delete icon shows confirmation dialog, then deletes the project
- [ ] Loading state shown while Convex query is fetching
- [ ] Table is responsive and looks clean with ShadCN styling