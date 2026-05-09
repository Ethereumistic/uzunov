import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";
import type { ProjectImage } from "#/types/project";

interface MainCarouselProps {
  images: ProjectImage[];
  resolvedUrls: (string | undefined)[];
  onImageClick: (index: number) => void;
}

export function MainCarousel({
  images,
  resolvedUrls,
  onImageClick,
}: MainCarouselProps) {
  const count = images.length;
  const [idx, setIdx] = useState(0);

  const prev = useCallback(() => setIdx((p) => (p - 1 + count) % count), [count]);
  const next = useCallback(() => setIdx((p) => (p + 1) % count), [count]);

  return (
    <button
      onClick={() => onImageClick(idx)}
      className="relative overflow-hidden rounded-3xl aspect-16/10 group w-full border border-black/5 shadow-lg"
    >
      <img
        key={idx}
        src={resolvedUrls[idx] ?? images[idx]?.url_legacy ?? ""}
        alt={`Изображение ${idx + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

      {count > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
      )}

      {count > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 backdrop-blur-sm border border-black/10 flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 duration-200"
            aria-label="Предишна"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 backdrop-blur-sm border border-black/10 flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 duration-200"
            aria-label="Следваща"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === idx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
                )}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 font-medium pointer-events-none">
            {idx + 1} / {count}
          </div>
        </>
      )}
    </button>
  );
}