# Phase 11c — Admin Editor: Image Upload & Sharp WebP Conversion

> **Prerequisite:** Phase 11b completed (editor form with text fields).
> **Commit message suggestion:** `feat: add image upload zones with Sharp WebP conversion to admin editor`

---

## Objective

Implement the image upload flow in the admin editor. This includes:
- Main image drop zone (position 0 in the gallery)
- Extra images drop zone (positions 1+)
- AR (aspect ratio) badge selector for each image (L/S/V)
- The 3-step upload pipeline: generateUploadUrl → PUT raw file → convertToWebp action
- Drag-to-reorder for extra images
- Thumbnail preview with remove button

---

## Step-by-step

### 11c.1 — Create the image upload hook

`src/hooks/useImageUpload.ts`:

```ts
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { ImageAR } from "#/types/project";

interface UploadResult {
  storageId: string;
  ar: ImageAR;
}

export function useImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const convertToWebp = useMutation(api.images.convertToWebp);

  const uploadImage = async (file: File, quality: number = 82): Promise<string> => {
    // Step 1: Get upload URL
    const uploadUrl = await generateUploadUrl({});

    // Step 2: Upload raw file to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Upload failed: ${result.statusText}`);
    }

    const { storageId: rawStorageId } = await result.json();

    // Step 3: Convert to WebP
    const { storageId: webpStorageId } = await convertToWebp({
      rawStorageId: rawStorageId,
      quality,
    });

    return webpStorageId;
  };

  return { uploadImage };
}
```

### 11c.2 — Create the main image drop zone component

`src/components/admin/ImageDropZone.tsx`:

```tsx
import { useCallback, useState } from "react";
import { useImageUpload } from "#/hooks/useImageUpload";
import type { ImageAR } from "#/types/project";

interface ImageDropZoneProps {
  onUploadComplete: (storageId: string, ar: ImageAR) => void;
  onRemove?: () => void;
  currentImage?: { storageId?: string; ar: ImageAR; url_legacy?: string };
  label?: string;
}

export function ImageDropZone({
  onUploadComplete,
  onRemove,
  currentImage,
  label = "Drag image here or click to select",
}: ImageDropZoneProps) {
  const { uploadImage } = useImageUpload();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const storageId = await uploadImage(file);
      onUploadComplete(storageId, currentImage?.ar ?? "L");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [uploadImage, onUploadComplete, currentImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  if (currentImage) {
    // Show thumbnail with remove button
    // Note: For new uploads with storageId, we need to resolve the URL
    // For now, show a placeholder or use url_legacy
    return (
      <div className="relative group rounded-xl overflow-hidden">
        {/* Image thumbnail — will use ProjectImage component or resolved URL */}
        <div className="h-48 bg-stone-100 flex items-center justify-center">
          <span className="text-stone-400">✓ Uploaded</span>
        </div>
        {/* AR badge */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {(["L", "S", "V"] as ImageAR[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onUploadComplete(currentImage.storageId!, ratio)}
              className={`px-2 py-0.5 text-xs font-bold rounded ${
                currentImage.ar === ratio
                  ? "bg-[#1a1916] text-white"
                  : "bg-white/80 text-stone-600"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragOver ? "border-[#1a1916] bg-stone-50" : "border-stone-200"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
          <p className="text-sm text-stone-500">Converting to WebP…</p>
        </div>
      ) : (
        <>
          <p className="text-stone-400">{label}</p>
          <label className="mt-2 inline-block cursor-pointer text-sm text-[#1a1916] font-medium hover:underline">
            Click to select
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
        </>
      )}
    </div>
  );
}
```

### 11c.3 — Create the multi-image drop zone with reorder

`src/components/admin/MultiImageDropZone.tsx`:

```tsx
import { useState, useCallback } from "react";
import { ImageDropZone } from "./ImageDropZone";
import type { ProjectImage } from "#/types/project";
import type { ImageAR } from "#/types/project";

interface MultiImageDropZoneProps {
  images: ProjectImage[];
  onImagesChange: (images: ProjectImage[]) => void;
}

export function MultiImageDropZone({ images, onImagesChange }: MultiImageDropZoneProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addImage = useCallback((storageId: string, ar: ImageAR) => {
    onImagesChange([...images, { storageId, ar }]);
  }, [images, onImagesChange]);

  const removeImage = useCallback((index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  }, [images, onImagesChange]);

  const updateAr = useCallback((index: number, ar: ImageAR) => {
    onImagesChange(images.map((img, i) => i === index ? { ...img, ar } : img));
  }, [images, onImagesChange]);

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
              className="relative group"
            >
              {/* Thumbnail preview */}
              <div className="h-24 bg-stone-100 rounded-lg flex items-center justify-center border">
                {image.url_legacy ? (
                  <img src={image.url_legacy} alt="" className="h-full w-full object-cover rounded-lg" />
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
                        : "bg-white/80 text-stone-500"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
              {/* Remove button */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
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
```

### 11c.4 — Integrate into the editor form

In `src/routes/admin/projects/new.tsx`, replace the images placeholder with:

```tsx
import { ImageDropZone } from "#/components/admin/ImageDropZone";
import { MultiImageDropZone } from "#/components/admin/MultiImageDropZone";

// In the form JSX, replace the placeholder with:

{/* Main Image */}
<div className="space-y-2">
  <Label>Main Image (carousel)</Label>
  {form.images.length > 0 ? (
    <div>
      <ImageDropZone
        onUploadComplete={(storageId, ar) => {
          const newImages = [...form.images];
          newImages[0] = { storageId, ar };
          setForm((prev) => ({ ...prev, images: newImages }));
        }}
        onRemove={() => {
          const newImages = form.images.slice(1);
          setForm((prev) => ({ ...prev, images: newImages }));
        }}
        currentImage={form.images[0]}
        label="Change main image"
      />
    </div>
  ) : (
    <ImageDropZone
      onUploadComplete={(storageId, ar) => {
        setForm((prev) => ({ ...prev, images: [{ storageId, ar }] }));
      }}
      label="Drag main image here or click to select"
    />
  )}
</div>

{/* Extra Images */}
{form.images.length > 0 && (
  <div className="space-y-2">
    <Label>Extra Images</Label>
    <MultiImageDropZone
      images={form.images.slice(1)}
      onImagesChange={(extraImages) => {
        setForm((prev) => ({
          ...prev,
          images: [prev.images[0], ...extraImages],
        }));
      }}
    />
  </div>
)}
```

### 11c.5 — Show uploaded image previews

For new uploads (only `storageId`, no `url_legacy`), we need to fetch the URL from Convex. Update `ImageDropZone` to use the `useImageUrl` hook or `useQuery(api.images.getImageUrl)` to display the preview.

For simplicity during upload, we can show the file's local object URL immediately and replace it with the Convex URL once available:

```tsx
// In ImageDropZone, before uploading, create a local preview:
const [localPreview, setLocalPreview] = useState<string | null>(null);

const handleFile = useCallback(async (file: File) => {
  // Show local preview immediately
  setLocalPreview(URL.createObjectURL(file));
  setUploading(true);
  try {
    const storageId = await uploadImage(file);
    onUploadComplete(storageId, currentImage?.ar ?? "L");
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    setUploading(false);
  }
}, [uploadImage, onUploadComplete, currentImage]);
```

---

## Files Touched

| Action | Path |
|--------|------|
| CREATE | `src/hooks/useImageUpload.ts` |
| CREATE | `src/components/admin/ImageDropZone.tsx` |
| CREATE | `src/components/admin/MultiImageDropZone.tsx` |
| EDIT | `src/routes/admin/projects/new.tsx` (integrate image upload) |

---

## Validation Checklist

- [ ] Drag-and-drop image upload works (main image)
- [ ] Click-to-select file upload works
- [ ] Upload progress spinner shows during conversion
- [ ] Sharp WebP conversion produces WebP files in Convex storage
- [ ] AR badge selector (L/S/V) works for each image
- [ ] Multi-image zone allows adding multiple images
- [ ] Images can be removed from the form
- [ ] Drag-to-reorder works for extra images
- [ ] Local preview shows immediately while WebP converts
- [ ] Raw (original) file is deleted from Convex storage after conversion