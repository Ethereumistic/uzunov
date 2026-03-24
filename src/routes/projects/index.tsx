import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs"
import {
  projects,
  allCategories,
  categoryLabels,
  type ProjectCategory,
} from "#/data/projects"
import { cn } from "#/lib/utils"
import { PageHeader } from "#/components/layout/PageHeader"
import { ProjectCard } from "#/components/projects/ProjectCard"

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectCategory>("All")

  const filtered =
    activeTab === "All" ? projects : projects.filter((p) => p.category === activeTab)

  return (
    <main className="min-h-screen p-5 bg-transparent">

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
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
