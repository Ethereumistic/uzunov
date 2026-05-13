import { cn } from "#/lib/utils";
import type { ProjectImage } from "#/types/project";

/** Max images shown in bento grid (after the main carousel image). */
const BENTO_MAX = 9;

type CellSpec = { cols: 1 | 2 | 3; rows: 1 | 2 };

export function buildBentoSpecs(images: ProjectImage[]): CellSpec[] {
  if (images.length === 0) return [];

  const specs: CellSpec[] = [];
  let cursor = 0;
  let rowIdx = 0;

  const place = (cols: 1 | 2 | 3, rows: 1 | 2) => {
    while (cursor + cols > 3) {
      cursor = 0;
      rowIdx++;
    }
    specs.push({ cols, rows });
    const newCursor = cursor + cols;
    if (newCursor >= 3) {
      rowIdx++;
      cursor = 0;
    } else {
      cursor = newCursor;
    }
  };

  // Special case: 2 images with a vertical one — the non-vertical spans full height
  if (images.length === 2) {
    if (images[0].ar === "V") {
      specs.push({ cols: 1, rows: 2 }); // first: vertical
      specs.push({ cols: 2, rows: 2 }); // second: spans full height
    } else if (images[1].ar === "V") {
      specs.push({ cols: 2, rows: 2 }); // first: spans full height
      specs.push({ cols: 1, rows: 2 }); // second: vertical
    } else {
      // Both landscape/square — default even split
      specs.push({ cols: 2, rows: 1 });
      specs.push({ cols: 1, rows: 1 });
    }
    return specs;
  }

  for (let i = 0; i < images.length; i++) {
    const ar = images[i].ar;
    const remaining = 3 - cursor;

    if (ar === "V") {
      place(1, 2);
    } else if (ar === "S") {
      place(1, 1);
    } else {
      const isEvenRow = rowIdx % 2 === 0;

      if (remaining === 3) {
        place(isEvenRow ? 2 : 1, 1);
      } else if (remaining === 2) {
        place(2, 1);
      } else {
        place(1, 1);
      }
    }
  }

  return specs;
}

interface ProjectBentoGridProps {
  images: ProjectImage[];
  resolvedUrls: (string | undefined)[];
  onImageClick: (index: number) => void;
  maxImages?: number;
}

export function ProjectBentoGrid({
  images,
  resolvedUrls,
  onImageClick,
  maxImages = BENTO_MAX,
}: ProjectBentoGridProps) {
  const showOverflow = images.length > maxImages;
  const visible = showOverflow ? images.slice(0, maxImages) : images;
  const overflow = images.length - maxImages;
  const specs = buildBentoSpecs(visible);

  return (
    <div
      className="grid gap-2 md:gap-5"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "160px",
        gridAutoFlow: "dense",
      }}
    >
      {visible.map((img, i) => {
        const spec = specs[i] ?? { cols: 1, rows: 1 };
        return (
          <button
            key={i}
            onClick={() => onImageClick(i)}
            className={cn(
              "relative overflow-hidden rounded-2xl group",
              "hover:border-[#1a1916]/20 transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2"
            )}
            style={{
              gridColumn: `span ${spec.cols}`,
              gridRow: `span ${spec.rows}`,
            }}
          >
            <img
              src={resolvedUrls[i] ?? img.url_legacy ?? ""}
              alt={`Изображение ${i + 2}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300" />
          </button>
        );
      })}

      {/* Overflow tile */}
      {showOverflow && (
        <button
          onClick={() => onImageClick(maxImages)}
          className="relative overflow-hidden rounded-2xl bg-stone-100 group border border-black/5"
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
        >
          {images[maxImages] && (
            <img
              src={resolvedUrls[maxImages] ?? images[maxImages]?.url_legacy ?? ""}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
            <span className="text-white text-2xl font-bold leading-none">+{overflow}</span>
            <span className="text-white/70 text-xs font-medium tracking-wide">снимки</span>
          </div>
        </button>
      )}
    </div>
  );
}