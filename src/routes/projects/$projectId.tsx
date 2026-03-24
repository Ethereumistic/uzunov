import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect, useCallback } from "react"
import {
  MapPin,
  Ruler,
  Trophy,
  ArrowLeft,
  Building2,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
} from "lucide-react"
import { getProjectById, categoryLabels } from "#/data/projects"
import { cn } from "#/lib/utils"

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const project = getProjectById(projectId)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }, [])

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 pt-32">
        <div className="text-center">
          <p className="text-6xl mb-4 opacity-20">◻</p>
          <h1 className="font-display text-2xl font-bold text-[#1a1916] mb-3">
            Проектът не е намерен
          </h1>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> Обратно към проекти
          </Link>
        </div>
      </main>
    )
  }

  const images = project.images
  const hasImages = images.length > 0

  return (
    <main className="min-h-screen px-5 pt-28 pb-24">
      <div className="max-w-6xl mx-auto">

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-black/40 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Всички проекти
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Left: Bento gallery */}
          <div className="flex flex-col gap-3">
            {hasImages ? (
              <BentoGallery images={images} onImageClick={openLightbox} />
            ) : (
              <div className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-video flex items-center justify-center">
                <span className="text-[5rem] opacity-10">◻</span>
              </div>
            )}
            {images.length > 1 && (
              <button
                onClick={() => openLightbox(0)}
                className="self-end inline-flex items-center gap-1.5 text-xs font-medium text-black/40 hover:text-black/70 transition-colors"
              >
                <Images size={13} />
                Виж всички {images.length} снимки
              </button>
            )}
          </div>

          {/* ── Right: Details glass panel */}
          <div className="sticky top-28 rounded-3xl border border-white/60 bg-linear-to-b from-white/80 to-white/50 backdrop-blur-[22px] shadow-[0_8px_32px_rgba(31,38,135,0.08)] saturate-150 p-7 flex flex-col gap-6">

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center text-[0.625rem] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-black/12 bg-black/5 text-black/60">
                {categoryLabels[project.category]}
              </span>
              {project.awards.map((_award, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-3 py-1 rounded-full bg-amber-400/90 text-amber-900 border border-amber-300/60"
                >
                  <Trophy size={10} />
                  Награда
                </span>
              ))}
            </div>

            <h1 className="font-display text-[1.375rem] font-bold leading-snug text-[#1a1916] m-0">
              {project.title}
            </h1>

            {project.description && (
              <p className="text-sm text-black/55 leading-relaxed">
                {project.description}
              </p>
            )}

            <div className="border-t border-black/6" />

            <div className="flex flex-col gap-4">
              <DetailRow icon={<MapPin size={15} />} label="Местоположение" value={project.location} />
              {project.area && (
                <DetailRow icon={<Ruler size={15} />} label="Разгърната площ" value={`${project.area.toLocaleString("bg-BG")} м²`} />
              )}
              <DetailRow icon={<User size={15} />} label="Инвеститор" value={project.investor} />
              <DetailRow icon={<Building2 size={15} />} label="Статус" value={project.status === "done" ? "Завършен" : "В процес"} />
              {project.completionDate && (
                <DetailRow icon={<Calendar size={15} />} label="Година" value={new Date(project.completionDate).getFullYear().toString()} />
              )}
            </div>

            {project.details && project.details.length > 0 && (
              <>
                <div className="border-t border-black/6" />
                <div>
                  <p className="text-[0.6875rem] font-semibold tracking-widest uppercase text-black/35 mb-3">
                    Сгради в комплекса
                  </p>
                  <div className="flex flex-col gap-2">
                    {project.details.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-black/60">{d.name}</span>
                        <span className="font-medium text-[#1a1916]">{d.area.toLocaleString("bg-BG")} м²</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {project.awards.length > 0 && (
              <>
                <div className="border-t border-black/6" />
                <div>
                  <p className="text-[0.6875rem] font-semibold tracking-widest uppercase text-black/35 mb-3">
                    Отличия
                  </p>
                  <div className="flex flex-col gap-2">
                    {project.awards.map((award, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Trophy size={13} className="text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-black/65 leading-snug">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && hasImages && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  )
}

// ─────────────────────────────────────────────
// BentoGallery
// A single unified CSS-grid gallery. No carousel.
// Layouts are defined per image count bucket so
// every cell gets a deliberate col/row span.
// ─────────────────────────────────────────────

type BentoItem = {
  /** CSS grid-column value, e.g. "span 2" */
  col: string
  /** CSS grid-row value, e.g. "span 2" */
  row: string
  /** aspect-ratio applied when the cell does NOT span rows */
  aspect?: string
}

/** Returns a bento layout spec for each image given the total count. */
function getBentoLayout(count: number): BentoItem[] {
  // Single image — full width hero
  if (count === 1) {
    return [{ col: "span 3", row: "span 2", aspect: undefined }]
  }

  // 2 images — side by side
  if (count === 2) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 2" },
    ]
  }

  // 3 images — large hero left, two stacked right
  if (count === 3) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
    ]
  }

  // 4 images — large hero top-left, three filling right + bottom
  if (count === 4) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 3", row: "span 1" },
    ]
  }

  // 5 images — large hero left, 2×2 grid right
  if (count === 5) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
    ]
  }

  // 6 images — 2 rows of 3
  if (count === 6) {
    return Array(6).fill({ col: "span 1", row: "span 1" })
  }

  // 7 images — hero top-left (2×2), 3 right, 2 bottom spanning
  if (count === 7) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 2", row: "span 1" },
    ]
  }

  // 8 images — hero top-left (2×2), 2 right column, bottom row of 3 + 1 wide
  if (count === 8) {
    return [
      { col: "span 2", row: "span 2" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
      { col: "span 1", row: "span 1" },
    ]
  }

  // 9 images — 3×3 uniform grid
  if (count === 9) {
    return Array(9).fill({ col: "span 1", row: "span 1" })
  }

  // 10–11 images — hero (2×2) + fill the rest in a 3-col grid
  if (count === 10 || count === 11) {
    const layout: BentoItem[] = [{ col: "span 2", row: "span 2" }]
    for (let i = 1; i < count; i++) {
      layout.push({ col: "span 1", row: "span 1" })
    }
    return layout
  }

  // 12 images — 4 rows of 3
  if (count === 12) {
    return Array(12).fill({ col: "span 1", row: "span 1" })
  }

  // 13–15 — hero + uniform fill
  if (count >= 13 && count <= 15) {
    const layout: BentoItem[] = [{ col: "span 3", row: "span 2" }]
    for (let i = 1; i < count; i++) {
      layout.push({ col: "span 1", row: "span 1" })
    }
    return layout
  }

  // Anything bigger — hero (2×2) + uniform 3-col fill, cap visible at 12 (rest in lightbox)
  const layout: BentoItem[] = [{ col: "span 2", row: "span 2" }]
  for (let i = 1; i < count; i++) {
    layout.push({ col: "span 1", row: "span 1" })
  }
  return layout
}

function BentoGallery({
  images,
  onImageClick,
}: {
  images: string[]
  onImageClick: (index: number) => void
}) {
  const count = images.length
  const layout = getBentoLayout(count)

  // For very large sets (>15), show only the first 13 cells in the grid
  // and the last visible cell becomes an overlay showing the remaining count.
  const MAX_VISIBLE = 15
  const showOverflow = count > MAX_VISIBLE
  const visibleImages = showOverflow ? images.slice(0, MAX_VISIBLE) : images
  const visibleLayout = showOverflow ? layout.slice(0, MAX_VISIBLE) : layout
  const overflow = count - MAX_VISIBLE

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "160px" }}
    >
      {visibleImages.map((img, i) => {
        const spec = visibleLayout[i] ?? { col: "span 1", row: "span 1" }
        const isLastAndOverflow = showOverflow && i === MAX_VISIBLE - 1

        return (
          <button
            key={i}
            onClick={() => onImageClick(i)}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-stone-100",
              "border-2 border-transparent hover:border-[#1a1916]/15",
              "transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1916]/30"
            )}
            style={{
              gridColumn: spec.col,
              gridRow: spec.row,
            }}
          >
            <img
              src={img}
              alt={`Изображение ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Subtle dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

            {/* Overflow count badge on last visible cell */}
            {isLastAndOverflow && (
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1">
                <span className="text-white text-2xl font-bold leading-none">+{overflow}</span>
                <span className="text-white/70 text-xs font-medium tracking-wide">снимки</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────
// DetailRow
// ─────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5 text-black/35">{icon}</div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[0.6875rem] font-semibold tracking-wider uppercase text-black/35">
          {label}
        </span>
        <span className="text-sm font-medium text-[#1a1916] leading-snug wrap-break-word">
          {value}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────

function Lightbox({
  images,
  currentIndex,
  onClose,
}: {
  images: string[]
  currentIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(currentIndex)

  const prevImage = useCallback(() => {
    setIndex((p) => (p - 1 + images.length) % images.length)
  }, [images.length])

  const nextImage = useCallback(() => {
    setIndex((p) => (p + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, prevImage, nextImage])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        onClick={onClose}
        aria-label="Затвори"
      >
        <X size={18} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); prevImage() }}
          aria-label="Предишна"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <img
        key={index}
        src={images[index]}
        alt={`Изображение ${index + 1}`}
        className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded-2xl select-none"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.18s ease" }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); nextImage() }}
          aria-label="Следваща"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/30 rounded-full px-4 py-1.5 select-none">
        {index + 1} / {images.length}
      </div>

      {/* Thumbnail strip at the bottom for easy jumping */}
      {images.length > 1 && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[min(640px,90vw)] overflow-x-auto pb-1 px-2 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i) }}
              className={cn(
                "shrink-0 size-12 rounded-lg overflow-hidden border-2 transition-all duration-200",
                i === index
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/20 opacity-50 hover:opacity-80"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}