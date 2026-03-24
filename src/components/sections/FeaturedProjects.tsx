import { Link } from "@tanstack/react-router"
import { MapPin, ChevronRight, Trophy, Ruler } from "lucide-react"
import { featuredProjects, categoryLabels } from "../../data/projects"
import { cn } from "../../lib/utils"

/* ── Category accent colours ─────────────────────────────────────── */
const categoryColour: Record<string, string> = {
  Office: "bg-sky-500/15 text-sky-700 border-sky-500/25",
  Healthcare: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
  Commercial: "bg-amber-500/15 text-amber-700 border-amber-500/25",
  Industrial: "bg-slate-500/15 text-slate-700 border-slate-500/25",
}

export function FeaturedProjects() {
  return (
    <section id="projects" className="w-full py-24 px-5">
      {/* ── Section header */}
      <div className="max-w-6xl mx-auto mb-14">
        <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-black/35 mb-3">
          Избрани проекти
        </p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-none tracking-tight text-[#1a1916] m-0">
            Работата,{" "}
            <em className="italic font-light">която говори</em>
          </h2>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-black transition-colors group"
          >
            Всички проекти
            <ChevronRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* ── Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredProjects.map((project, i) => (
          <Link
            key={project.id}
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-linear-to-b from-white/70 to-white/40 backdrop-blur-[18px] shadow-[0_8px_32px_rgba(31,38,135,0.07)] saturate-150 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(31,38,135,0.13)] hover:border-white/80"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

              {/* Category badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={cn(
                    "inline-flex items-center text-[0.625rem] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border backdrop-blur-xl",
                    categoryColour[project.category] ??
                      "bg-white/20 text-white/80 border-white/20"
                  )}
                >
                  {categoryLabels[project.category]}
                </span>
              </div>

              {/* Award ribbon */}
              {project.awards.length > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 backdrop-blur-xl border border-amber-300/60">
                    <Trophy size={10} />
                    Награда
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
              <h3 className="font-display text-[0.9375rem] font-semibold leading-snug text-[#1a1916] line-clamp-2">
                {project.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-black/45">
                <MapPin size={12} className="shrink-0" />
                <span>{project.location}</span>
              </div>

              {project.area && (
                <div className="flex items-center gap-1.5 text-xs text-black/45">
                  <Ruler size={12} className="shrink-0" />
                  <span>{project.area.toLocaleString("bg-BG")} м²</span>
                </div>
              )}

              {project.awards.length > 0 && (
                <p className="text-[0.6875rem] text-amber-700/80 leading-snug line-clamp-2 mt-auto">
                  {project.awards[0]}
                </p>
              )}

              {/* Bottom CTA */}
              <div className="mt-auto pt-3 border-t border-black/6 flex items-center justify-between">
                <span className="text-xs text-black/35 font-medium">
                  {project.completionDate
                    ? new Date(project.completionDate).getFullYear()
                    : "В процес"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-black/60 group-hover:text-black transition-colors duration-200">
                  Виж проекта
                  <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
