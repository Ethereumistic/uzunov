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