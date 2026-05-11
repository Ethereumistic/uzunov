import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { ArrowLeft } from "lucide-react"
import { ProjectDetailView } from "#/components/projects/ProjectDetailView"
import { getLocale } from "#/paraglide/runtime"
import { m } from "#/paraglide/messages"

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { slug } = Route.useParams()
  const project = useQuery(api.projects.getBySlug, { slug })
  const locale = getLocale()

  // Loading state
  if (project === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center px-0 md:px-5 pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      </main>
    )
  }

  // Not found
  if (project === null) {
    return (
      <main className="min-h-screen flex items-center justify-center px-0 md:px-5 pt-32">
        <div className="text-center">
          <p className="text-6xl mb-4 opacity-20">◻</p>
          <h1 className="font-display text-2xl font-bold text-[#1a1916] mb-3">
            {m["projects.notFound"]()}
          </h1>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} /> {m["projects.backToProjects"]()}
          </Link>
        </div>
      </main>
    )
  }

  return <ProjectDetailView project={project} locale={locale} />
}
