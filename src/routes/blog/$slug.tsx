import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { getLocale } from "#/paraglide/runtime";
import { m } from "#/paraglide/messages";
import { getLocalizedValue, hasEnValue } from "#/lib/localeField";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function formatDate(dateStr: string, locale: string = "bg"): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = useQuery(api.posts.getBySlug, { slug });
  const locale = getLocale();

  // Loading state
  if (post === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </main>
    );
  }

  // Not found
  if (post === null) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 pt-32">
        <div className="text-center">
          <p className="text-6xl mb-4 opacity-20">📝</p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            {m["blog.notFound"]()}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> {m["blog.backToBlog"]()}
          </Link>
        </div>
      </main>
    );
  }

  return <BlogPostDetailView post={post} locale={locale} />;
}

function BlogPostDetailView({ post, locale }: { post: any; locale: "bg" | "en" }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const title = getLocalizedValue(post, "title", locale);
  const excerpt = getLocalizedValue(post, "excerpt", locale);
  const body = getLocalizedValue(post, "body", locale);
  const showOnlyBulgarianNotice = locale === "en" && !hasEnValue(post, "body");

  // Collect all image storage IDs for URL resolution
  const coverStorageId = post.coverImage as string | undefined;
  const galleryStorageIds = post.images
    .map((img: any) => img.storageId)
    .filter((id: any): id is string => !!id) as Id<"_storage">[];
  const allStorageIds: Id<"_storage">[] = [
    ...(coverStorageId ? [coverStorageId as Id<"_storage">] : []),
    ...galleryStorageIds,
  ];

  const urlMap = useQuery(
    allStorageIds.length > 0
      ? api.images.getImageUrls
      : ("skip" as any),
    allStorageIds.length > 0
      ? { storageIds: allStorageIds }
      : ("skip" as any),
  ) as Record<string, string | null> | undefined;

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  }, []);

  // Build ordered image URLs for the gallery
  const coverUrl = coverStorageId && urlMap ? urlMap[coverStorageId] : null;

  const galleryImages = post.images
    .map((img: any) => {
      if (img.storageId && urlMap) {
        return urlMap[img.storageId] ?? img.url_legacy ?? "";
      }
      return img.url_legacy ?? "";
    })
    .filter(Boolean);

  // All images for lightbox: cover first, then gallery
  const allLightboxImages = [
    ...(coverUrl ? [coverUrl] : []),
    ...galleryImages,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-transparent">
      {/* Back link */}
      <div className="px-2 md:px-5 pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors group"
          >
            <Button variant="ghost" size="icon" className="size-10 rounded-full">
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </Button>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              {m["blog.backToBlog"]()}
            </span>
          </Link>
        </div>
      </div>

      {/* Two-column layout: desktop */}
      <div className="px-2 md:px-5 pt-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5 lg:gap-10 items-start">
            {/* LEFT COLUMN: Images */}
            <div className="flex flex-col gap-3">
              {/* Cover image - main hero */}
              {coverUrl && (
                <div
                  className="relative rounded-3xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(0)}
                >
                  <img
                    src={coverUrl}
                    alt={title}
                    className="w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              )}

              {/* Gallery thumbnails */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {galleryImages.map((url: string, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "relative rounded-2xl overflow-hidden cursor-pointer group",
                        galleryImages.length === 1
                          ? "col-span-full aspect-[16/9]"
                          : "aspect-square"
                      )}
                      onClick={() => openLightbox(coverUrl ? i + 1 : i)}
                    >
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              )}

              {/* If no images at all */}
              {!coverUrl && galleryImages.length === 0 && (
                <div className="relative rounded-3xl bg-foreground/5 aspect-[16/9] flex items-center justify-center">
                  <span className="text-6xl opacity-10">📝</span>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Title + Date + Body */}
            <div className="lg:sticky lg:top-28">
              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                {title}
              </h1>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time>{formatDate(post.displayDate, locale)}</time>
              </div>

              {/* Bulgarian-only notice */}
              {showOnlyBulgarianNotice && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  {m["blog.onlyBulgarian"]()}
                </div>
              )}

              {/* Excerpt - desktop only (hidden on mobile, shown here for desktop sticky column) */}
              {excerpt && (
                <p className="text-lg text-foreground/70 leading-relaxed mb-6 font-medium border-l-4 border-[#c5a882] pl-4">
                  {excerpt}
                </p>
              )}

              {/* Rich text body */}
              {body ? (
                <div
                  className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-sm"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <p className="text-foreground/30 italic">No content yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && allLightboxImages.length > 0 && (
        <LightboxModal
          images={allLightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  );
}

// ──────────────────────────────────────────────
// Lightbox component
// ──────────────────────────────────────────────
function LightboxModal({
  images,
  currentIndex,
  onClose,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(currentIndex);

  const prev = useCallback(() => {
    setIndex((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((p) => (p + 1) % images.length);
  }, [images.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prev, next]);

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
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <button
          className="absolute left-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <img
        key={index}
        src={images[index]}
        alt={`Image ${index + 1}`}
        className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded-2xl select-none"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.18s ease" }}
      />

      {images.length > 1 && (
        <button
          className="absolute right-5 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next"
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
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
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
