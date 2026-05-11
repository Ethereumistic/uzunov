import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
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

export const Route = createFileRoute("/admin/blog/")({
  component: AdminBlogPage,
});

function AdminBlogPage() {
  const posts = useQuery(api.posts.list);
  const reorderPosts = useMutation(api.posts.reorder);
  const removePost = useMutation(api.posts.remove);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"posts">;
    title: string;
  } | null>(null);

  // Local drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex !== null && index !== overIndex) {
      setOverIndex(index);
    }
  };

  const handleDrop = async () => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    if (!posts) return;

    const reordered = [...posts];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);

    const orders = reordered.map((p, i) => ({ id: p._id, order: i }));
    await reorderPosts({ orders });

    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removePost({ id: deleteTarget.id });
    setDeleteTarget(null);
  };

  // Compute visual order with drag preview
  const displayItems = posts ? [...posts] : [];
  if (dragIndex !== null && overIndex !== null && posts && dragIndex !== overIndex) {
    const [moved] = displayItems.splice(dragIndex, 1);
    displayItems.splice(overIndex, 0, moved);
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Blog</h1>
        <Link to="/admin/blog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Draggable post list */}
      <div className="flex flex-col gap-3">
        {displayItems.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-lg font-medium mb-2">No blog posts yet</p>
            <p className="text-sm">Create your first blog post to get started.</p>
          </div>
        ) : (
          displayItems.map((post, index) => {
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== overIndex;

            return (
              <div
                key={post._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
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

                {/* Cover image or placeholder */}
                <div className="w-32 md:w-48 shrink-0 bg-muted rounded-l-xl overflow-hidden">
                  <PostCoverImage storageId={post.coverImage} />
                </div>

                {/* Content */}
                <div className="flex flex-1 items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{post.title_bg}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={post.published ? "default" : "outline"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      <span className="text-xs text-stone-400">
                        {formatDate(post.displayDate)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link to="/admin/blog/$postId/edit" params={{ postId: post._id }}>
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
                        setDeleteTarget({ id: post._id, title: post.title_bg });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
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

function PostCoverImage({ storageId }: { storageId?: string }) {
  const url = useQuery(
    storageId
      ? api.images.getImageUrl
      : ("skip" as any),
    storageId ? { storageId: storageId as Id<"_storage"> } : ("skip" as any),
  ) as string | null | undefined;

  if (!storageId) {
    return (
      <div className="flex h-full min-h-[80px] items-center justify-center text-muted-foreground text-2xl">
        📝
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex h-full min-h-[80px] items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-600" />
      </div>
    );
  }

  return <img src={url} alt="" className="h-full w-full object-cover" />;
}