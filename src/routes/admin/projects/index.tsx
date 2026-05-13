import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical, Save } from "lucide-react";
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
import { cn } from "#/lib/utils";
import {
  Building2,
  Hospital,
  ShoppingBag,
  Factory,
  Home,
  Armchair,
  type LucideIcon,
} from "lucide-react";
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

const categoryIcons: Record<string, LucideIcon> = {
  Office: Building2,
  Healthcare: Hospital,
  Commercial: ShoppingBag,
  Industrial: Factory,
  Residential: Home,
  Interior: Armchair,
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
  // Pending order — only persisted when user clicks Save
  const [pendingOrder, setPendingOrder] = useState<Id<"projects">[] | null>(null);
  const isDirty = pendingOrder !== null;

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
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

  const handleDrop = useCallback(() => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    if (!projects) return;

    const currentOrder = pendingOrder ?? projects.map((p) => p._id);
    const reordered = [...currentOrder];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);

    setPendingOrder(reordered);
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, projects, pendingOrder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeProject({ id: deleteTarget.id });
    setDeleteTarget(null);
    // Clear pending order if deleted project was in it
    if (pendingOrder) {
      setPendingOrder(pendingOrder.filter((id) => id !== deleteTarget.id));
    }
  };

  const handleSave = async () => {
    if (!pendingOrder || !projects) return;
    const orders = pendingOrder.map((id, i) => ({ id, order: i }));
    await reorderProjects({ orders });
    setPendingOrder(null);
  };

  const handleReset = () => {
    setPendingOrder(null);
  };

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  // Current display order
  const displayIds = pendingOrder ?? projects.map((p) => p._id);
  const displayItems = displayIds
    .map((id) => projects.find((p) => p._id === id)!)
    .filter(Boolean);

  // Compute visual drag preview
  const previewItems = [...displayItems];
  if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
    const [moved] = previewItems.splice(dragIndex, 1);
    previewItems.splice(overIndex, 0, moved);
  }

  return (
    <div className="min-h-screen p-2 md:p-5 bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-display font-bold">Projects</h1>
        <Link to="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-5 items-stretch">
          {previewItems.map((project, index) => {
            if (!project) return null;
            const isDragging = dragIndex === displayIds.findIndex((id) => id === project._id);
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== overIndex;
            const realIndex = displayIds.findIndex((id) => id === project._id);
            const CategoryIcon = categoryIcons[project.category] || Building2;

            return (
              <div
                key={project._id}
                className={cn(
                  "group relative h-[440px] w-full overflow-hidden rounded-3xl border-0 bg-transparent flex flex-col justify-end transition-all duration-300",
                  isDragging ? "opacity-40 scale-[0.98]" : "opacity-100",
                  isOver && !isDragging ? "ring-2 ring-primary" : "",
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, realIndex)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              >
                {/* Drag handle overlay (top-left) */}
                <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20">
                    <GripVertical className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <div className="h-full w-full overflow-hidden">
                    {project.images.length > 0 ? (
                      <ProjectImage
                        image={project.images[0]}
                        alt={project.title_bg}
                        className="w-full h-full object-cover transition-transform duration-2000 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-stone-300 to-stone-500 transition-transform duration-2000 ease-out group-hover:scale-105">
                        <span className="text-6xl opacity-20">◻</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/95 transition-opacity duration-700" />
                </div>

                {/* Category badge (above icon+title) */}
                <div className="absolute bottom-28 left-6 z-20">
                  <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg">
                    {categoryLabels[project.category] ?? project.category}
                  </Badge>
                </div>

                {/* Edit button (centered) */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to="/admin/projects/$projectId/edit"
                    params={{ projectId: project._id }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/30 text-[#1a1916] shadow-lg font-medium hover:bg-white transition-all">
                      <Pencil className="h-4 w-4" />
                      Редактирай
                    </div>
                  </Link>
                </div>

                {/* Delete button (top-right) */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-500/80 backdrop-blur-md border border-red-400/50 text-white shadow-lg hover:bg-red-600 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: project._id, title: project.title_bg });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content block */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col w-full h-full justify-end overflow-hidden">
                  <div className="flex items-center gap-4 transition-all duration-300">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14">
                      <CategoryIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-md leading-tight">
                      {project.title_bg}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}

          {/* CTA card */}
          <div className="col-span-1">
            <div className="relative h-full min-h-[440px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2676&auto=format&fit=crop"
                alt="Architectural pattern"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-0" />
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
                <div className="relative bg-white/10 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl max-w-sm">
                  <h3 className="font-display text-2xl font-semibold mb-2 text-white leading-tight">
                    Имаш идея?
                  </h3>
                  <p className="text-white/90 mb-4 text-sm">
                    Създай нов проект и добави към портфолиото си.
                  </p>
                  <Link to="/admin/projects/new">
                    <button className="px-6 py-3 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 shadow-lg">
                      Нов проект
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save bar */}
      {isDirty && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-xl">
            <span className="text-sm text-muted-foreground font-medium">
              Незаписани промени
            </span>
            <div className="h-6 w-px bg-border" />
            <Button variant="outline" size="sm" onClick={handleReset}>
              Отмени
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Запази
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на проект</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете „{deleteTarget?.title}"? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Отказ
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}