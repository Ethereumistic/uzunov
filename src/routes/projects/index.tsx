import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { MapPin, Ruler, Trophy, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs"
import {
  projects,
  allCategories,
  categoryLabels,
  type ProjectCategory,
} from "#/data/projects"
import { cn } from "#/lib/utils"
import { PageHeader } from "#/components/layout/PageHeader"

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})

const categoryColour: Record<string, string> = {
  Office: "bg-sky-500/15 text-sky-700 border-sky-500/25",
  Healthcare: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
  Commercial: "bg-amber-500/15 text-amber-700 border-amber-500/25",
  Industrial: "bg-slate-500/15 text-slate-700 border-slate-500/25",
}

function NoImagePlaceholder({ category }: { category: string }) {
  const colours: Record<string, string> = {
    Office: "from-sky-100 to-sky-50",
    Healthcare: "from-emerald-100 to-emerald-50",
    Commercial: "from-amber-100 to-amber-50",
    Industrial: "from-slate-200 to-slate-100",
  }
  return (
    <div
      className={cn(
        "w-full h-full bg-linear-to-br flex items-center justify-center",
        colours[category] ?? "from-stone-100 to-stone-50"
      )}
    >
      <span className="text-4xl opacity-20">◻</span>
    </div>
  )
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const hasImage = project.images.length > 0

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-linear-to-b from-white/70 to-white/40 backdrop-blur-[18px] shadow-[0_8px_32px_rgba(31,38,135,0.07)] saturate-150 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(31,38,135,0.13)] hover:border-white/80"
    >
      <div className="relative h-48 overflow-hidden rounded-t-3xl bg-stone-100">
        {hasImage ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <NoImagePlaceholder category={project.category} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center text-[0.625rem] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border backdrop-blur-xl",
              categoryColour[project.category] ?? "bg-white/30 text-white border-white/30"
            )}
          >
            {categoryLabels[project.category]}
          </span>
        </div>

        {project.awards.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 backdrop-blur-xl border border-amber-300/60">
              <Trophy size={10} />
              Награда
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-display text-[0.875rem] font-semibold leading-snug text-[#1a1916] line-clamp-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-xs text-black/45">
            <MapPin size={11} className="shrink-0" />
            <span>{project.location}</span>
          </div>
          {project.area && (
            <div className="flex items-center gap-1 text-xs text-black/45">
              <Ruler size={11} className="shrink-0" />
              <span>{project.area.toLocaleString("bg-BG")} м²</span>
            </div>
          )}
        </div>

        {project.awards.length > 0 && (
          <p className="text-[0.6875rem] text-amber-700/80 leading-snug line-clamp-2">
            {project.awards[0]}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-black/6 flex items-center justify-between">
          <span className="text-xs text-black/35 font-medium">
            {project.completionDate
              ? new Date(project.completionDate).getFullYear()
              : "В процес"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-black/50 group-hover:text-black transition-colors duration-200">
            Виж проекта
            <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectCategory>("All")

  const filtered =
    activeTab === "All" ? projects : projects.filter((p) => p.category === activeTab)

  return (
    <main className="min-h-screen p-5 bg-[#faf9f6]">

      <PageHeader
        label="Портфолио"
        title={<>Нашите <em className="italic font-light">проекти</em></>}
        subtitle="Над три десетилетия проектиране — офиси, болници, търговски обекти и индустриални съоръжения в цяла България."
      />
      <div className="max-w-7xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ProjectCategory)}
          className="mb-10"
        >
          <TabsList className="h-auto px-1.5 py-1.5 bg-white/60 backdrop-blur-[18px] border border-white/60 shadow-[0_4px_16px_rgba(31,38,135,0.06)] rounded-2xl gap-1">
            {allCategories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className={cn(
                  "rounded-xl text-sm font-medium px-4 py-2 transition-all duration-200",
                  "data-[state=active]:bg-[#1a1916] data-[state=active]:text-white data-[state=active]:shadow-md",
                  "data-[state=inactive]:text-black/50 data-[state=inactive]:hover:text-black",
                  "dark:data-[state=active]:bg-[#1a1916] dark:data-[state=active]:text-white"
                )}
              >
                {categoryLabels[cat]}
                <span className="ml-1.5 text-[0.625rem] tabular-nums opacity-50">
                  {cat === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {allCategories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-8">
              {filtered.length === 0 ? (
                <p className="text-black/40 text-sm">Няма намерени проекти.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
