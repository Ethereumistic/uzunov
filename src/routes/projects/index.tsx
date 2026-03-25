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

  const ctaClasses = {
    mobile: "col-span-1",
    tablet: filtered.length % 2 === 0 ? "sm:col-span-2" : "sm:col-span-1",
    desktop: filtered.length % 3 === 0 ? "lg:col-span-3" : filtered.length % 3 === 1 ? "lg:col-span-2" : "lg:col-span-1"
  }

  return (
    <main className="min-h-screen p-5 bg-transparent">

      <PageHeader
        title={<>Нашите <em className="italic font-light">проекти</em></>}
        subtitle="Над три десетилетия проектиране — офиси, болници, търговски обекти и индустриални съоръжения в цяла България."
      />
      <div className="max-w-7xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ProjectCategory)}
          className="mb-10"
        >
          <div className="w-full flex justify-center">
            <TabsList className="grid w-full grid-cols-3 md:flex md:w-fit mb-8">
              {allCategories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-lg text-xs sm:text-sm"
                >
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {allCategories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-8">
              {filtered.length === 0 ? (
                <p className="text-black/40 text-sm">Няма намерени проекти.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 items-stretch">
                  {filtered.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                  <div className={cn(
                    ctaClasses.mobile,
                    ctaClasses.tablet,
                    ctaClasses.desktop
                  )}>
                    {/* ADDED: min-h-[320px], flex, items-center, justify-center to the main container */}
                    <div className="relative h-full min-h-[320px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-stone-100 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60">

                      <img
                        src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2676&auto=format&fit=crop"
                        alt="Architectural pattern"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-0" />
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />

                      {/* CHANGED: from "absolute inset-0" to "relative z-10" so the content dictates structural volume */}
                      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
                        <div className="relative bg-white/10 backdrop-blur-md rounded-full w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                          <svg className="w-8 h-8 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 sm:p-5 lg:p-6 border border-white/20 shadow-xl max-w-sm">
                          <h3 className="font-display text-2xl font-semibold mb-2 sm:text-xl lg:text-2xl text-white leading-tight">Имате идея?</h3>
                          <p className="text-white/90 mb-4 sm:mb-3 lg:mb-4 text-sm">Свържете се с нас за консултация по вашия следващ проект</p>
                          <button className="px-6 py-3 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 sm:px-5 sm:py-2 lg:px-6 lg:py-3 shadow-lg">
                            Свържете се с нас
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
