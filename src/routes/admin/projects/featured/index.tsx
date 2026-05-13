import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, GripVertical, Save, Star } from "lucide-react";
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
import type { Id } from "../../../../../convex/_generated/dataModel";
import type { Doc } from "../../../../../convex/_generated/dataModel";

export const Route = createFileRoute("/admin/projects/featured/")({
  component: FeaturedProjectsPage,
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

type ProjectDocType = Doc<"projects">;

function FeaturedProjectsPage() {
  const featuredProjects = useQuery(api.projects.listFeatured);
  const allProjects = useQuery(api.projects.list);
  const reorderFeatured = useMutation(api.projects.reorderFeatured);
  const removeFeatured = useMutation(api.projects.removeFeatured);
  const addFeatured = useMutation(api.projects.addFeatured);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"projects">;
    title: string;
  } | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Local drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
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

    if (!featuredProjects) return;

    const currentOrder = pendingOrder ?? featuredProjects.map((p: ProjectDocType) => p._id);
    const reordered = [...currentOrder];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);

    setPendingOrder(reordered as Id<"projects">[]);
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, featuredProjects, pendingOrder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleRemove = async () => {
    if (!deleteTarget) return;
    await removeFeatured({ id: deleteTarget.id });
    setDeleteTarget(null);
    if (pendingOrder) {
      setPendingOrder(pendingOrder.filter((id: Id<"projects">) => id !== deleteTarget.id));
    }
  };

  const handleAdd = async (projectId: Id<"projects">) => {
    await addFeatured({ id: projectId });
    setShowAddDialog(false);
  };

  const handleSave = async () => {
    if (!pendingOrder || !featuredProjects) return;
    const orders = pendingOrder.map((id: Id<"projects">, i: number) => ({ id, featuredOrder: i }));
    await reorderFeatured({ orders });
    setPendingOrder(null);
  };

  const handleReset = () => {
    setPendingOrder(null);
  };

  if (featuredProjects === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  // Current display order
  const displayIds = pendingOrder ?? featuredProjects.map((p: ProjectDocType) => p._id);
  const displayItems = displayIds
    .map((id: Id<"projects">) => featuredProjects.find((p: ProjectDocType) => p._id === id))
    .filter((p): p is ProjectDocType => p !== undefined);

  // Non-featured projects that can be added
  const featuredIds = new Set(featuredProjects.map((p: ProjectDocType) => p._id));
  const availableProjects = (allProjects ?? []).filter(
    (p: ProjectDocType) => !featuredIds.has(p._id) && p.images.length > 0,
  );

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
        <div className="flex items-center gap-3">
          <Link to="/admin/projects">
            <Button variant="ghost" size="icon">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl font-display font-bold">Featured Projects</h1>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Info message */}
      {displayItems.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-medium mb-2">No featured projects</h3>
            <p className="text-muted-foreground mb-6">Add projects to display them in the homepage featured section.</p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add your first project
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-5 items-stretch">
              {previewItems.map((project: ProjectDocType, index: number) => {
                const isDragging = dragIndex === displayIds.findIndex((id: Id<"projects">) => id === project._id);
                const isOver = overIndex === index && dragIndex !== null && dragIndex !== overIndex;
                const realIndex = displayIds.findIndex((id: Id<"projects">) => id === project._id);
                const CategoryIcon = categoryIcons[project.category] || Building2;

                return (
                  <div
                    key={project._id}
                    className={cn(
                      "group relative h-[440px] w-full overflow-hidden rounded-3xl border-0 bg-transparent flex flex-col justify-end transition-all duration-300",
                      isDragging ? "opacity-40 scale-[0.98]" : "opacity-100",
                      isOver && !isDragging ? "ring-2 ring-amber-500" : "",
                    )}
                    draggable
                    onDragStart={(e: React.DragEvent) => handleDragStart(e, realIndex)}
                    onDragOver={(e: React.DragEvent) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag handle overlay (top-left) */}
                    <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
                      <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20">
                        <GripVertical className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Featured badge */}
                    <div className="absolute top-4 left-14 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/90 backdrop-blur-md border border-amber-400/50 text-white shadow-lg">
                        <Star className="h-3.5 w-3.5 fill-white" />
                        <span className="text-xs font-medium">#{index + 1}</span>
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

                    {/* Category badge (top-right) */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg">
                        {categoryLabels[project.category] ?? project.category}
                      </Badge>
                    </div>

                    {/* Edit button (centered) */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link
                        to="/admin/projects/$projectId/edit"
                        params={{ projectId: project._id }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/30 text-[#1a1916] shadow-lg font-medium hover:bg-white transition-all">
                          <Pencil className="h-4 w-4" />
                          Редактирай
                        </div>
                      </Link>
                    </div>

                    {/* Delete button (below category badge) */}
                    <div className="absolute top-16 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-500/80 backdrop-blur-md border border-red-400/50 text-white shadow-lg hover:bg-red-600 transition-all"
                        onClick={(e: React.MouseEvent) => {
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
        </>
      )}

      {/* Add Project Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add to Featured</DialogTitle>
            <DialogDescription>
              Select a project to add to the featured section.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {availableProjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                All projects are already featured.
              </p>
            ) : (
              <div className="space-y-2">
                {availableProjects.map((project: ProjectDocType) => (
                  <button
                    key={project._id}
                    onClick={() => handleAdd(project._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    {project.images.length > 0 && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <ProjectImage
                          image={project.images[0]}
                          alt={project.title_bg}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.title_bg}</p>
                      <p className="text-sm text-muted-foreground">
                        {categoryLabels[project.category] ?? project.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Затвори
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Премахване отfeatured</DialogTitle>
            <DialogDescription>
              Премахнете „{deleteTarget?.title}" от секцията с отличени проекти?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Отказ
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Премахни
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}