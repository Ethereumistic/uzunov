import { useState, useCallback } from "react";
import { ImageDropZone } from "./ImageDropZone";
import type { ProjectImage, ImageAR } from "#/types/project";

interface MultiImageDropZoneProps {
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

export function MultiImageDropZone({ images, onImagesChange }: MultiImageDropZoneProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addImage = useCallback(
    (storageId: string, ar: ImageAR) => {
      onImagesChange([...images, { storageId, ar }]);
    },
    [images, onImagesChange],
  );

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange(images.filter((_, i) => i !== index));
    },
    [images, onImagesChange],
  );

  const updateAr = useCallback(
    (index: number, ar: ImageAR) => {
      onImagesChange(images.map((img, i) => (i === index ? { ...img, ar } : img)));
    },
    [images, onImagesChange],
  );

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, moved);
    onImagesChange(newImages);
    setDragIndex(index);
  };

  return (
    <div className="space-y-2">
      {/* Existing images — reorderable grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, i) => (
            <div
              key={image.storageId ?? i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={() => setDragIndex(null)}
              className="relative group cursor-grab active:cursor-grabbing"
            >
              {/* Thumbnail preview */}
              <div className="h-24 bg-stone-100 rounded-lg flex items-center justify-center border overflow-hidden">
                {image.url_legacy ? (
                  <img
                    src={image.url_legacy}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-stone-400 text-xs">#{i + 1}</span>
                )}
              </div>
              {/* AR badges */}
              <div className="absolute bottom-1 left-1 flex gap-0.5">
                {(["L", "S", "V"] as ImageAR[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => updateAr(i, ratio)}
                    className={`px-1.5 py-0.5 text-[0.6rem] font-bold rounded ${
                      image.ar === ratio
                        ? "bg-[#1a1916] text-white"
                        : "bg-white/80 text-stone-500 hover:bg-white"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
              {/* Remove button */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add more images drop zone */}
      <ImageDropZone
        onUploadComplete={(storageId, ar) => addImage(storageId, ar)}
        label="Drag extra images here or click to select"
      />
    </div>
  );
}