import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectImage } from "#/components/projects/ProjectImage";
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
import type { Id } from "../../../../convex/_generated/dataModel";

export const Route = createFileRoute("/admin/projects/")({
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
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
      <div className="rounded-xl border border-border bg-card">
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
                  {project.images.length > 0 ? (
                    <ProjectImage
                      image={project.images[0]}
                      alt={project.title_bg}
                      className="h-10 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-muted-foreground">
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
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
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