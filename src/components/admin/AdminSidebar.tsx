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