import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Button } from "#/components/ui/button";
import { Trash2, Plus, Search } from "lucide-react";
import type { ImageAR } from "#/types/project";

interface ImageGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (image: { storageId: string; ar: ImageAR; url_legacy?: string }) => void;
  /** Storage IDs already in the current form (to show "Already added" badge) */
  currentImageIds: Set<string>;
}

export function ImageGalleryDialog({
  open,
  onOpenChange,
  onSelectImage,
  currentImageIds,
}: ImageGalleryDialogProps) {
  const allImages = useQuery(api.projects.listAllImages);
  const deleteImage = useMutation(api.images.deleteImage);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (storageId: string) => {
    setDeleting(storageId);
    try {
      await deleteImage({ storageId: storageId as any });
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image. It may be referenced by another project.");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  // Filter images by search
  const filtered = (allImages ?? []).filter((img) =>
    img.projectName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Gallery</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by project name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto mt-4">
          {allImages === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              {search ? "No images match your search" : "No images uploaded yet"}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filtered.map((img) => {
                const isAdded = currentImageIds.has(img.storageId);
                const isDeleting = deleting === img.storageId;
                const isConfirmingDelete = confirmDelete === img.storageId;

                return (
                  <div
                    key={img.storageId}
                    className="relative group rounded-xl overflow-hidden border border-stone-200 bg-white"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square bg-stone-100 overflow-hidden">
                      {img.url || img.url_legacy ? (
                        <img
                          src={img.url ?? img.url_legacy}
                          alt={img.projectName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          ◻
                        </div>
                      )}
                    </div>

                    {/* Project name badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[0.6rem] text-white font-medium">
                      {img.projectName}
                    </div>

                    {/* AR badge */}
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#1a1916] rounded text-[0.6rem] text-white font-bold">
                      {img.ar}
                    </div>

                    {/* Already added badge */}
                    {isAdded && (
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 bg-green-600/90 backdrop-blur-sm rounded text-[0.6rem] text-white text-center font-medium">
                        Already in project
                      </div>
                    )}

                    {/* Action buttons on hover */}
                    {!isAdded && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            onSelectImage({
                              storageId: img.storageId,
                              ar: img.ar,
                              url_legacy: img.url_legacy,
                            });
                            onOpenChange(false);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    )}

                    {/* Delete button */}
                    {isConfirmingDelete ? (
                      <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 text-[0.6rem] px-2"
                          onClick={() => handleDelete(img.storageId)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "…" : "Confirm"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[0.6rem] px-2"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(img.storageId)}
                        className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-red-500/80 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete from gallery"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}