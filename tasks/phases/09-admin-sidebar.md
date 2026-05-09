# Phase 09 — Admin Sidebar & Layout

> **Prerequisite:** Phase 08 completed (login works, auth guard in place).
> **Commit message suggestion:** `feat: build admin sidebar with ShadCN and sign-out`

---

## Objective

Build the admin sidebar using ShadCN's `Sidebar` component. It shows navigation links (Projects for now, more items later) and a sign-out button. It integrates with the authenticated admin layout.

---

## Step-by-step

### 9.1 — Install ShadCN Sidebar components

If not already installed, add the ShadCN sidebar component:

```bash
vp dlx shadcn@latest add sidebar
```

This should add `src/components/ui/sidebar.tsx` and related files.

### 9.2 — Implement `src/components/admin/AdminSidebar.tsx`

```tsx
import { Link, useRouter } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { FolderOpen, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
} from "#/components/ui/sidebar";
import { Button } from "#/components/ui/button";

export function AdminSidebar() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/admin-login" });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/admin/projects" className="flex items-center gap-2 px-2 py-1">
          <span className="text-xl font-display font-bold text-[#1a1916]">
            Узунов
          </span>
          <span className="text-xs text-stone-400 font-medium">admin</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/projects">
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
```

### 9.3 — Update `src/routes/admin/_layout.tsx`

Wire up the sidebar in the authenticated layout:

```tsx
import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useConvexAuth } from "@convex-dev/auth/react";
import { SidebarProvider } from "#/components/ui/sidebar";
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
    return <Navigate to="/admin-login" />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
```

### 9.4 — Verify navigation

- The sidebar appears on all `/admin/*` routes (except login)
- Clicking "Projects" navigates to `/admin/projects`
- Clicking "Sign Out" signs the user out and redirects to the login page
- The sidebar shows the "Узунов" wordmark with "admin" label

---

## Files Touched

| Action | Path |
|--------|------|
| EDIT | `src/components/admin/AdminSidebar.tsx` (full implementation) |
| EDIT | `src/routes/admin/_layout.tsx` (add SidebarProvider) |

---

## Validation Checklist

- [ ] ShadCN Sidebar component is installed
- [ ] Admin sidebar renders with wordmark and navigation
- [ ] "Projects" link navigates to `/admin/projects`
- [ ] "Sign Out" button works — signs out and redirects to login
- [ ] Sidebar is responsive (collapses on mobile)
- [ ] Auth guard still works — unauthenticated → login redirect