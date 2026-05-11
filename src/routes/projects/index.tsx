import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import {
  LayoutGrid,
  Building2,
  BriefcaseMedical,
  ShoppingBag,
  Factory,
  Home,
  Armchair,
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { Doc } from "../../../convex/_generated/dataModel"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs"
import { cn } from "#/lib/utils"
import { PageHeader } from "#/components/layout/PageHeader"
import { ProjectCard } from "#/components/projects/ProjectCard"
import { allCategories, type ProjectCategoryFilter, getCategoryLabelKey, getCategoryBulgarianLabel } from "#/types/project"
import { useProjectImageUrls } from "#/hooks/useProjectImages"
import { m } from "#/paraglide/messages"

const categoryIcons: Record<ProjectCategoryFilter, React.ElementType> = {
  All: LayoutGrid,
  Office: Building2,
  Healthcare: BriefcaseMedical,
  Commercial: ShoppingBag,
  Industrial: Factory,
  Residential: Home,
  Interior: Armchair,
}

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectCategoryFilter>("All")

  const allProjects = useQuery(api.projects.list) ?? null

  const filtered = activeTab === "All"
    ? (allProjects ?? [])
    : (allProjects ?? []).filter((p) => p.category === activeTab)

  // Helper to safely get translated category label
  const getCategoryLabel = (cat: ProjectCategoryFilter) => {
    const key = getCategoryLabelKey(cat)
    const messageFn = m[key as keyof typeof m]
    if (typeof messageFn === "function") {
      return messageFn()
    }
    // Fallback to Bulgarian if message not loaded yet
    return getCategoryBulgarianLabel(cat)
  }

  return (
    <main className="min-h-screen p-2 md:p-5 bg-transparent">

      <PageHeader
        title={<>{(m["projects.title"]()).split(" ").slice(0, -1).join(" ")}{" "}<em className="italic font-light">{(m["projects.title"]()).split(" ").slice(-1)[0]}</em></>}
        subtitle={m["projects.subtitle"]()}
        className="md:mb-5 mb-2"
      />
      <div className="max-w-7xl mx-auto">
        {allProjects === null ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ProjectCategoryFilter)}
            className=""
          >
            <div className="w-full flex justify-center">
              <TabsList className="grid border-black/10 border w-full grid-cols-2 xs:grid-cols-3 md:flex md:w-auto h-auto gap-2 p-1.5 bg-background/30 backdrop-blur-sm rounded-2xl">
                {allCategories.map((cat, index) => {
                  const Icon = categoryIcons[cat]
                  const isLast = index === allCategories.length - 1
                  return (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className={cn(
                        "group rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 data-[state=active]:bg-black  data-[state=active]:shadow-sm data-[state=active]:text-white text-foreground dark:text-foreground/80 hover:text-black/80",
                        isLast && "col-span-2 xs:col-span-3 md:col-span-1"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:opacity-100 opacity-60" />
                      <span className="font-medium tracking-tight whitespace-nowrap">{getCategoryLabel(cat)}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {allCategories.map((cat) => (
              <TabsContent key={cat} value={cat} className="">
                {filtered.length === 0 ? (
                  <p className="text-foreground text-sm text-center py-16">{m["projects.noProjectsFound"]()}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-5 items-stretch md:mt-3 mt-0">
                    {filtered.map((project) => (
                      <ProjectCardWithImage key={project._id} project={project} />
                    ))}
                    <div className={cn(
                      filtered.length % 3 === 0 ? "lg:col-span-3" : filtered.length % 3 === 1 ? "lg:col-span-2" : "lg:col-span-1",
                      filtered.length % 2 === 0 ? "sm:col-span-2" : "sm:col-span-1",
                      "col-span-1"
                    )}>
                      <div className="relative h-full min-h-[320px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl  transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60">
                        <img
                          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2676&auto=format&fit=crop"
                          alt="Architectural pattern"
                          className="absolute inset-0 w-full h-full object-cover z-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-0" />
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />
                        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
                          <div className="relative bg-white/10 backdrop-blur-md rounded-full w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                            <svg className="w-8 h-8 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 sm:p-5 lg:p-6 border border-white/20 shadow-xl max-w-sm">
                            <h3 className="font-display text-2xl font-semibold mb-2 sm:text-xl lg:text-2xl text-white leading-tight">{m["cta.haveIdea"]()}</h3>
                            <p className="text-white/90 mb-4 sm:mb-3 lg:mb-4 text-sm">{m["cta.contactConsultation"]()}</p>
                            <button className="px-6 py-3 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 sm:px-5 sm:py-2 lg:px-6 lg:py-3 shadow-lg">
                              {m["cta.contactUs"]()}
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
        )}
      </div>
    </main>
  )
}

/** Wrapper component that resolves the first image URL for a project card */
function ProjectCardWithImage({ project }: { project: Doc<"projects"> }) {
  const resolvedUrls = useProjectImageUrls(project.images)
  const firstImageUrl = project.images.length > 0 ? resolvedUrls[0] : null
  return <ProjectCard project={project} imageUrl={firstImageUrl} />
}
