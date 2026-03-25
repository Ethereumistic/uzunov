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
} from "lucide-react"
import { OtherProjectsSection } from "#/components/sections/OtherProjectsSection"
import { getProjectById, categoryLabels } from "#/data/projects"
import { cn } from "#/lib/utils"
import { Button } from "#/components/ui/button"
import { PageHeader } from "#/components/layout/PageHeader"
import type { SlideData } from "#/components/layout/HeroSlider"

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

  // Build hero slide from the first image (for PageHeader)
  const heroSlide: SlideData | undefined = hasImages
    ? {
        id: `${project.id}-hero`,
        src: images[0],
        alt: project.title,
      }
    : undefined

  // CTA image: last image, or first if only one
  const ctaImage = hasImages ? images[images.length - 1] : null

  return (
    <div className="min-h-screen bg-transparent">
      {/* ── PageHeader (same as service pages) ── */}
      <div className="p-5 pb-0">
        <PageHeader
          title={
            <>
              {project.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="italic font-light">
                {project.title.split(" ").slice(-1)[0]}
              </em>
            </>
          }
          subtitle={project.description}
          slides={heroSlide ? [heroSlide] : undefined}
        />
      </div>

      {/* ── Back link ── */}
      <div className="px-5 pt-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-black/40 hover:text-black transition-colors group"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-black/10 size-10 bg-white hover:bg-black/5 transition-all duration-300 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-black/70" />
            </Button>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              Обратно към проекти
            </span>
          </Link>
        </div>
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="px-5 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">

          {/*
            Desktop: 3 columns
              col 1–2 (2fr): Carousel + Bento Grid
              col 3 (1fr): Sticky details panel
            Mobile: stacked
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-10 items-start">

            {/* ── LEFT: Carousel + Bento Grid (2 cols on desktop) ── */}
            <div className="flex flex-col gap-4">
              {hasImages ? (
                <>
                  <MainCarousel
                    images={images}
                    onImageClick={openLightbox}
                  />

                  {/* Bento grid for images[1..] */}
                  {images.length > 1 && (
                    <ProjectBentoGrid
                      images={images.slice(1)}
                      onImageClick={(i) => openLightbox(i + 1)}
                    />
                  )}
                </>
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-video flex items-center justify-center">
                  <span className="text-[5rem] opacity-10">◻</span>
                </div>
              )}
            </div>

            {/* ── RIGHT: Sticky details panel (1 col on desktop) ── */}
            <div className="lg:sticky lg:top-28 flex flex-col gap-6">

              {/* Glass details card */}
              <div className="rounded-3xl border border-white/60 bg-linear-to-b from-white/80 to-white/50 backdrop-blur-[22px] shadow-[0_8px_32px_rgba(31,38,135,0.08)] saturate-150 p-7 flex flex-col gap-6">

                {/* Category + Awards */}
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

                {/* Project Title */}
                <h1 className="font-display text-[1.375rem] font-bold leading-snug text-[#1a1916] m-0">
                  {project.title}
                </h1>

                {project.description && (
                  <p className="text-sm text-black/55 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="border-t border-black/6" />

                {/* Detail rows */}
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

                {/* Building details */}
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

                {/* Awards */}
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

                {/* Image count hint */}
                {images.length > 1 && (
                  <>
                    <div className="border-t border-black/6" />
                    <button
                      onClick={() => openLightbox(0)}
                      className="inline-flex items-center gap-2 text-xs font-medium text-black/40 hover:text-black/70 transition-colors self-start"
                    >
                      Виж всички {images.length} снимки →
                    </button>
                  </>
                )}
              </div>

              {/* ── CTA Card (mirrors ServiceLayout) ── */}
              {ctaImage && (
                <div className="relative h-auto min-h-[280px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-stone-100 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60 group">
                  <img
                    src={ctaImage}
                    alt="Contact CTA"
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20 z-0" />
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />

                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
                    <div className="relative bg-white/10 backdrop-blur-md rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl max-w-xs">
                      <h3 className="font-display text-xl font-semibold mb-2 text-white leading-tight">Имате идея?</h3>
                      <p className="text-white/90 mb-4 text-sm">Свържете се с нас за консултация по вашия следващ проект</p>
                      <a
                        href="/#contact"
                        className="inline-block px-6 py-2.5 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 shadow-lg text-sm"
                      >
                        Свържете се с нас
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Other projects ── */}
          <div className="mt-24 border-t border-stone-200 pt-20">
            <OtherProjectsSection currentProjectId={projectId} />
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && hasImages && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MainCarousel
// Full-width carousel for the primary (hero) image slot
// ─────────────────────────────────────────────

function MainCarousel({
  images,
  onImageClick,
}: {
  images: string[]
  onImageClick: (index: number) => void
}) {
  const count = images.length
  const [carouselIndex, setCarouselIndex] = useState(0)

  const prevImage = useCallback(() => {
    setCarouselIndex((p) => (p - 1 + count) % count)
  }, [count])

  const nextImage = useCallback(() => {
    setCarouselIndex((p) => (p + 1) % count)
  }, [count])

  return (
    <button
      onClick={() => onImageClick(carouselIndex)}
      className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-[16/10] group w-full border border-black/5 shadow-lg"
    >
      <img
        key={carouselIndex}
        src={images[carouselIndex]}
        alt={`Изображение ${carouselIndex + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Subtle scrim on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

      {/* Bottom gradient for counter */}
      {count > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
      )}

      {count > 1 && (
        <>
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 backdrop-blur-sm border border-black/10 flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 duration-200"
            aria-label="Предишна"
          >
            <ChevronLeft size={18} />
          </button>
          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white/80 backdrop-blur-sm border border-black/10 flex items-center justify-center text-black/70 hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 duration-200"
            aria-label="Следваща"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === carouselIndex
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 font-medium pointer-events-none">
            {carouselIndex + 1} / {count}
          </div>
        </>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────
// ProjectBentoGrid
// Renders images[1..] in a beautiful bento layout
// that adapts to 1–15+ images robustly.
// ─────────────────────────────────────────────

type BentoSpec = {
  colSpan: number // out of 3
  rowSpan: number
}

/**
 * Returns a bento layout for `n` auxiliary images (images[1..]).
 * Grid is 3-column with fixed row heights.
 */
function getBentoSpecs(n: number): BentoSpec[] {
  // n = count of images AFTER the main carousel image

  if (n === 1) {
    // One wide image below
    return [{ colSpan: 3, rowSpan: 1 }]
  }

  if (n === 2) {
    // Two equal side by side
    return [
      { colSpan: 2, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ]
  }

  if (n === 3) {
    // 1 wide top + 2 equal below
    return [
      { colSpan: 3, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
    ]
  }

  if (n === 4) {
    // 2x2 grid — 1 big left + 2 stacked right + 1 wide
    return [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 3, rowSpan: 1 },
    ]
  }

  if (n === 5) {
    // 1 big + 2 right column + 2 below
    return [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
    ]
  }

  if (n === 6) {
    // 3x2 uniform
    return Array(6).fill({ colSpan: 1, rowSpan: 1 })
  }

  if (n === 7) {
    // Big top-left + 4 small + 1 wide bottom
    return [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 2, rowSpan: 1 },
    ]
  }

  if (n === 8) {
    // Big top-left + 6 uniform small
    return [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ]
  }

  if (n === 9) {
    // 3x3 uniform
    return Array(9).fill({ colSpan: 1, rowSpan: 1 })
  }

  // 10+ → big feature + rest uniform
  const specs: BentoSpec[] = [{ colSpan: 2, rowSpan: 2 }]
  const remaining = Math.min(n - 1, 14) // cap visible at 15 total
  for (let i = 0; i < remaining; i++) {
    specs.push({ colSpan: 1, rowSpan: 1 })
  }
  return specs
}

function ProjectBentoGrid({
  images,
  onImageClick,
}: {
  images: string[]      // images AFTER the main carousel
  onImageClick: (index: number) => void
}) {
  const MAX_VISIBLE = 14 // bento can hold 14 + 1 overflow tile = 15 cells
  const showOverflow = images.length > MAX_VISIBLE
  const visibleImages = showOverflow ? images.slice(0, MAX_VISIBLE) : images
  const overflow = images.length - MAX_VISIBLE

  const specs = getBentoSpecs(visibleImages.length + (showOverflow ? 1 : 0))
  // If showOverflow, replace last spec with span-1 for "+N" tile
  const effectiveSpecs = showOverflow
    ? [...specs.slice(0, MAX_VISIBLE), { colSpan: 1, rowSpan: 1 }]
    : specs

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "160px",
      }}
    >
      {visibleImages.map((img, i) => {
        const spec = effectiveSpecs[i] ?? { colSpan: 1, rowSpan: 1 }
        return (
          <button
            key={i}
            onClick={() => onImageClick(i)}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-stone-100 group",
              "border border-black/5 shadow-sm",
              "hover:border-[#1a1916]/20 transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1916]/30"
            )}
            style={{
              gridColumn: `span ${spec.colSpan}`,
              gridRow: `span ${spec.rowSpan}`,
            }}
          >
            <img
              src={img}
              alt={`Изображение ${i + 2}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>
        )
      })}

      {/* Overflow tile */}
      {showOverflow && (
        <button
          onClick={() => onImageClick(MAX_VISIBLE)}
          className="relative overflow-hidden rounded-2xl bg-stone-100 group border border-black/5"
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
        >
          {images[MAX_VISIBLE] && (
            <img
              src={images[MAX_VISIBLE]}
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

      {/* Thumbnail strip */}
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