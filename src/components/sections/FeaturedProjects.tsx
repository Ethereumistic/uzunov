import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { featuredProjects } from "../../data/projects"
import { ProjectCard } from "../projects/ProjectCard"

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
            Работа,{" "}
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
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
