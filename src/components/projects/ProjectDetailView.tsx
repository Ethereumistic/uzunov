import { useState, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, X, ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ui/button";
import { PageHeader } from "#/components/layout/PageHeader";
import { OtherProjectsSection } from "#/components/sections/OtherProjectsSection";
import { MainCarousel } from "#/components/projects/MainCarousel";
import { ProjectBentoGrid } from "#/components/projects/ProjectBentoGrid";
import { ProjectDetailCard } from "#/components/projects/ProjectDetailCard";
import { useProjectImageUrls } from "#/hooks/useProjectImages";
import type { Project } from "#/types/project";
import type { SlideData } from "#/components/layout/HeroSlider";
import { m } from "#/paraglide/messages";
import { getLocale } from "#/paraglide/runtime";

interface ProjectDetailViewProps {
  project: Project;
  locale?: "bg" | "en";
  /** Whether to show the "Other projects" section at the bottom */
  showOtherProjects?: boolean;
  /** Whether to show the back-link and page header */
  showPageHeader?: boolean;
}

export function ProjectDetailView({
  project,
  locale: propLocale,
  showOtherProjects = true,
  showPageHeader = true,
}: ProjectDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const locale = propLocale ?? getLocale();
  const isBg = locale === "bg";

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }, []);

  const images = project.images;
  const hasImages = images.length > 0;

  // Resolve all image URLs via Convex storage
  const resolvedUrls = useProjectImageUrls(images);

  const title = isBg ? project.title_bg : project.title_en;
  const description = isBg ? project.description_bg : project.description_en;

  // Hero slide for PageHeader
  const heroSlide: SlideData | undefined =
    hasImages && resolvedUrls[0]
      ? { id: `${project.slug}-hero`, src: resolvedUrls[0]!, alt: title ?? project.slug }
      : undefined;

  // CTA image is the last image
  const ctaImageUrl =
    hasImages && resolvedUrls[resolvedUrls.length - 1]
      ? resolvedUrls[resolvedUrls.length - 1]!
      : null;

  // All URLs for lightbox
  const allUrls = resolvedUrls.map(
    (u, i) => u ?? images[i]?.url_legacy ?? "",
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* PageHeader */}
      {showPageHeader && heroSlide && (
        <div className="p-2 md:p-5 pb-0">
          <PageHeader
            title={
              <>
                {(title ?? "").split(" ").slice(0, -1).join(" ")}{" "}
                <em className="italic font-light">
                  {(title ?? "").split(" ").slice(-1)[0]}
                </em>
              </>
            }
            subtitle={description ?? undefined}
            slides={heroSlide ? [heroSlide] : undefined}
          />
        </div>
      )}

      {showPageHeader && (
        <div className="px-2 md:px-5 pt-4">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group"
            >
              <Button variant="ghost" size="icon" className="size-10 rounded-full">
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </Button>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {m["projectDetail.backToProjects"]()}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="px-2 md:px-5 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-2 lg:gap-5 items-start">
            {/* LEFT: Carousel + Bento */}
            <div className="flex flex-col gap-2 md:gap-5">
              {hasImages ? (
                <>
                  <MainCarousel
                    images={images}
                    resolvedUrls={resolvedUrls}
                    onImageClick={openLightbox}
                  />
                  {images.length > 1 && (
                    images.length === 2 ? (
                      <button
                        onClick={() => openLightbox(1)}
                        className="relative overflow-hidden rounded-3xl group hover:border-[#1a1916]/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                      >
                        <img
                          src={resolvedUrls[1] ?? images[1]?.url_legacy ?? ""}
                          alt={`Изображение 2`}
                          className="w-full h-64 md:h-96 object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300" />
                      </button>
                    ) : (
                      <ProjectBentoGrid
                        images={images.slice(1)}
                        resolvedUrls={resolvedUrls.slice(1)}
                        onImageClick={(i) => openLightbox(i + 1)}
                      />
                    )
                  )}
                </>
              ) : (
                <div className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-video flex items-center justify-center">
                  <span className="text-[5rem] opacity-10">◻</span>
                </div>
              )}
            </div>

            {/* RIGHT: Sticky details + CTA */}
            <div className="lg:sticky lg:top-28 flex flex-col gap-2 md:gap-5">
              <ProjectDetailCard project={project} locale={locale} />

              {/* CTA Card */}
              {ctaImageUrl && (
                <div className="relative h-auto min-h-[280px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] group">
                  <img
                    src={ctaImageUrl}
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
                      <h3 className="font-display text-xl font-semibold mb-2 text-white leading-tight">
                        {m["cta.haveIdea"]()}
                      </h3>
                      <p className="text-white/90 mb-4 text-sm">
                        {m["cta.contactConsultation"]()}
                      </p>
                      <a
                        href="/#contact"
                        className="inline-block px-6 py-2.5 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 shadow-lg text-sm"
                      >
                        {m["cta.contactUs"]()}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Other projects */}
          {showOtherProjects && (
            <div className="mt-24 pt-20">
              <OtherProjectsSection currentProjectSlug={project.slug} />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && hasImages && (
        <Lightbox
          images={allUrls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Lightbox (embedded for self-containment)
// ─────────────────────────────────────────────

function Lightbox({
  images,
  currentIndex,
  onClose,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(currentIndex);

  const prevImage = useCallback(() => {
    setIndex((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImage = useCallback(() => {
    setIndex((p) => (p + 1) % images.length);
  }, [images.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevImage, nextImage]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 size-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        onClick={onClose}
        aria-label={m["projectDetail.close"]()}
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <button
          className="absolute left-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); prevImage() }}
          aria-label={m["projectDetail.previous"]()}
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <img
        key={index}
        src={images[index]}
        alt={`${m["projectDetail.image"]()} ${index + 1}`}
        className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded-2xl select-none"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.18s ease" }}
      />

      {images.length > 1 && (
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); nextImage() }}
          aria-label={m["projectDetail.next"]()}
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/30 rounded-full px-4 py-1.5 select-none">
        {index + 1} / {images.length}
      </div>

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
  );
}
