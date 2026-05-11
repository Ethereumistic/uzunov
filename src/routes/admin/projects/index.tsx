import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { ProjectImage } from "#/components/projects/ProjectImage";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
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
  const reorderProjects = useMutation(api.projects.reorder);
  const removeProject = useMutation(api.projects.remove);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"projects">;
    title: string;
  } | null>(null);

  // Local drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set a transparent drag image so the native ghost is minimal
    const el = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(el, 0, 0);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex !== null && index !== overIndex) {
        setOverIndex(index);
      }
    },
    [dragIndex, overIndex],
  );

  const handleDrop = useCallback(async () => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    if (!projects) return;

    // Build new order locally
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);

    // Persist with new sequential order values
    const orders = reordered.map((p, i) => ({ id: p._id, order: i }));
    await reorderProjects({ orders });

    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, projects, reorderProjects]);

  const handleDragEnd = useCallback(() => {
    // Only reset if we didn't complete a drop (e.g. cancelled)
    setDragIndex(null);
    setOverIndex(null);
  }, []);

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

  // Compute visual order: apply drag preview
  const displayItems = [...projects];
  if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
    const [moved] = displayItems.splice(dragIndex, 1);
    displayItems.splice(overIndex, 0, moved);
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
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

      {/* Draggable project list */}
      <div className="flex flex-col gap-3">
        {displayItems.map((project, index) => {
          // Map display index back to the original data index for drag state
          const isDragging = dragIndex === projects.findIndex((p) => p._id === project._id);
          const isOver = overIndex === index && dragIndex !== null && dragIndex !== overIndex;

          return (
            <div
              key={project._id}
              draggable
              onDragStart={(e) => {
                const realIndex = projects.findIndex((p) => p._id === project._id);
                handleDragStart(e, realIndex);
              }}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className={`
                group relative flex rounded-xl border bg-card text-card-foreground shadow-sm
                transition-all duration-150 cursor-grab active:cursor-grabbing
                ${isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"}
                ${isOver && !isDragging ? "border-primary ring-2 ring-primary/20" : "border-border"}
                hover:border-primary/50
              `}
            >
              {/* Drag handle */}
              <div className="flex items-center px-2 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Thumbnail */}
              <div className="w-40 md:w-56 shrink-0 bg-muted rounded-l-xl overflow-hidden">
                {project.images.length > 0 ? (
                  <ProjectImage
                    image={project.images[0]}
                    alt={project.title_bg}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[100px] items-center justify-center text-muted-foreground">
                    ◻
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{project.title_bg}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary">
                      {categoryLabels[project.category] ?? project.category}
                    </Badge>
                    <Badge variant={project.status === "done" ? "default" : "outline"}>
                      {project.status === "done" ? "Завършен" : "В процес"}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link to="/admin/projects/$projectId/edit" params={{ projectId: project._id }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: project._id, title: project.title_bg });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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