import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { ProjectCard } from "../projects/ProjectCard"
import { useProjectImageUrls } from "#/hooks/useProjectImages"
import type { Doc } from "../../../convex/_generated/dataModel"
import { m } from "../../paraglide/messages"

type ProjectDoc = Doc<"projects">

export function FeaturedProjects() {
  const allProjects = useQuery(api.projects.list)
  const featuredProjects = (allProjects ?? []).filter((p) => p.featured && p.images.length > 0)

  return (
    <section id="projects" className="w-full py-24 px-0 md:px-5">
      {/* ── Section header */}
      <div className="mb-10 text-center">
        <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] tracking-tight text-foreground">
          {(() => {
            const t = m["projects.featuredTitle"]()
            const [first, ...rest] = t.split(' ')
            return <>{first}{rest.length > 0 && <span className="font-bold"> {rest.join(' ')}</span>}</>
          })()}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-foreground/90 font-light leading-relaxed">
          {m["projects.featuredDescription"]()}
        </p>
      </div>

      {/* ── Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
        {featuredProjects.map((project) => (
          <ProjectCardWithImage key={project._id} project={project} />
        ))}
      </div>

      {/* ── CTA button */}
      <div className="mt-16 flex justify-center">
        <Link
          to="/projects"
          className="group flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-background font-medium transition-all duration-300 hover:bg-foreground/80 hover:shadow-lg"
        >
          {m["projects.viewAll"]()}
          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}

/** Wrapper component that resolves the first image URL for a project card */
function ProjectCardWithImage({ project }: { project: ProjectDoc }) {
  const resolvedUrls = useProjectImageUrls(project.images)
  const firstImageUrl = project.images.length > 0 ? resolvedUrls[0] : null
  return <ProjectCard project={project} imageUrl={firstImageUrl} />
}