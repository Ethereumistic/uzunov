import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
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
import { getProjectById, categoryLabels } from "#/data/projects"
import { cn } from "#/lib/utils"

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const project = getProjectById(projectId)
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

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

  function prevImage() {
    setActiveImage((p) => (p - 1 + images.length) % images.length)
  }
  function nextImage() {
    setActiveImage((p) => (p + 1) % images.length)
  }

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

          {/* ── Left: Image gallery */}
          <div className="flex flex-col gap-4">
            <div
              className="relative overflow-hidden rounded-3xl bg-stone-100 aspect-16/10 cursor-pointer"
              onClick={() => hasImages && setLightboxOpen(true)}
            >
              {hasImages ? (
                <img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${project.title} — изображение ${activeImage + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[5rem] opacity-10">◻</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 flex items-center justify-center text-[#1a1916] shadow-md hover:bg-white transition-all duration-150"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 flex items-center justify-center text-[#1a1916] shadow-md hover:bg-white transition-all duration-150"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 text-xs font-medium text-white/80 bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full">
                  {activeImage + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "shrink-0 size-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      i === activeImage
                        ? "border-[#1a1916] opacity-100 shadow-md"
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Миниатюра ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
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
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={18} />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={images[activeImage]}
            alt={project.title}
            className="max-w-full max-h-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/60 bg-black/30 rounded-full px-4 py-1.5">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  )
}

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
