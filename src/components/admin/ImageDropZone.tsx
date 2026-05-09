import { useCallback, useState, useRef } from "react";
import { useImageUpload } from "#/hooks/useImageUpload";
import type { ImageAR } from "#/types/project";

interface ImageDropZoneProps {
  onUploadComplete: (storageId: string, ar: ImageAR) => void;
  label?: string;
  className?: string;
}

export function ImageDropZone({
  onUploadComplete,
  label = "Drag image here or click to select",
  className,
}: ImageDropZoneProps) {
  const { uploadImage } = useImageUpload();
  const [uploading, setUploading] = useState(false);
  const [reusedNotice, setReusedNotice] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setReusedNotice(false);
      try {
        const result = await uploadImage(file);
        if (result.deduplicated) {
          // Brief visual flash that the image was reused, not uploaded
          setReusedNotice(true);
          setTimeout(() => setReusedNotice(false), 2500);
        }
        onUploadComplete(result.storageId, "L");
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [uploadImage, onUploadComplete],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
        // Reset input so the same file can be uploaded again
        e.target.value = "";
      }
    },
    [handleFile],
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
        dragOver
          ? "border-[#1a1916] bg-stone-50"
          : reusedNotice
            ? "border-green-400 bg-green-50/50"
            : "border-stone-200 hover:border-stone-300"
      } ${className ?? ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
          <p className="text-sm text-stone-500">Uploading & converting to WebP…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm text-stone-500">{label}</p>
          <p className="text-xs text-stone-400">or drop files here</p>
          {reusedNotice && (
            <p className="text-xs text-green-600 font-medium mt-1">
              ✓ Image already in library — reused!
            </p>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}