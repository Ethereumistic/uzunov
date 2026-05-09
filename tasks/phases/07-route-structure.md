# Phase 07 — Admin Route Structure

> **Prerequisite:** Phase 01 completed (auth working).
> **Commit message suggestion:** `feat: create admin route file structure`

---

## Objective

Create all the route files for the admin panel. At this phase, we create the file structure and basic components (layouts, redirects) without the full business logic — just enough to navigate between routes and verify the auth guard works.

---

## Step-by-step

### 7.1 — Create the directory structure

```
src/routes/admin/
├── _layout.tsx              ← Admin layout with auth guard
├── index.tsx                ← Redirects to /admin/projects
├── login.tsx                ← Login page (built in Phase 08)
└── projects/
    ├── index.tsx            ← Projects list (built in Phase 10)
    ├── new.tsx              ← WYSIWYG create form (built in Phase 11)
    └── $projectId/
        └── edit.tsx         ← WYSIWYG edit form (built in Phase 11)
```

### 7.2 — Create `src/routes/admin/_layout.tsx`

The admin layout wraps all `/admin/*` routes. It contains the sidebar and an auth guard that redirects unauthenticated users to `/admin/login`.

```tsx
import { Outlet, Navigate } from "@tanstack/react-router";
import { useConvexAuth } from "@convex-dev/auth/react";
import { AdminSidebar } from "#/components/admin/AdminSidebar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

**Note:** `createFileRoute` needs to be imported from `@tanstack/react-router`. The `AdminSidebar` component will be built in Phase 09. For now, create a placeholder.

### 7.3 — Create `src/routes/admin/index.tsx`

```tsx
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => <Navigate to="/admin/projects" />,
});
```

### 7.4 — Create `src/routes/admin/login.tsx`

Placeholder for now — the full login page is built in Phase 08:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPlaceholder,
});

function AdminLoginPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Login page — coming in Phase 08</p>
    </div>
  );
}
```

### 7.5 — Create `src/routes/admin/projects/index.tsx`

Placeholder for the projects list table (Phase 10):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPlaceholder,
});

function AdminProjectsPlaceholder() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      <p>Projects list table — coming in Phase 10</p>
    </div>
  );
}
```

### 7.6 — Create `src/routes/admin/projects/new.tsx`

Placeholder for the project creation form (Phase 11):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProjectPlaceholder,
});

function NewProjectPlaceholder() {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Project</h1>
      <p>Project creation form — coming in Phase 11</p>
    </div>
  );
}
```

### 7.7 — Create `src/routes/admin/projects/$projectId/edit.tsx`

Placeholder for the project edit form (Phase 11):

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/projects/$projectId/edit")({
  component: EditProjectPlaceholder,
});

function EditProjectPlaceholder() {
  const { projectId } = Route.useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <p>Editing project: {projectId}</p>
    </div>
  );
}
```

### 7.8 — Create placeholder `src/components/admin/AdminSidebar.tsx`

```tsx
export function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-stone-50 p-4">
      <h2 className="text-lg font-bold">Admin</h2>
      <p>Sidebar — coming in Phase 09</p>
    </aside>
  );
}
```

### 7.9 — Verify route structure

Run `vp run dev` and verify:
- `/admin` redirects to `/admin/projects`
- `/admin/login` shows the placeholder
- `/admin/projects` shows the placeholder
- `/admin/projects/new` shows the placeholder
- `/admin/projects/{id}/edit` shows the placeholder
- Unauthenticated visitors to `/admin/*` are redirected to `/admin/login`

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/routes/admin/_layout.tsx` |
| CREATE | `src/routes/admin/index.tsx` |
| CREATE | `src/routes/admin/login.tsx` |
| CREATE | `src/routes/admin/projects/index.tsx` |
| CREATE | `src/routes/admin/projects/new.tsx` |
| CREATE | `src/routes/admin/projects/$projectId/edit.tsx` |
| CREATE | `src/components/admin/AdminSidebar.tsx` |

---

## Validation Checklist

- [ ] All admin route files exist
- [ ] `/admin` redirects to `/admin/projects`
- [ ] `/admin/login` renders placeholder
- [ ] Auth guard redirect works (unauthenticated → `/admin/login`)
- [ ] Auth guard shows loading spinner while checking auth
- [ ] All admin routes render their placeholders