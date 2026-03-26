import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { featuredProjects } from "../../data/projects"
import { ProjectCard } from "../projects/ProjectCard"

export function FeaturedProjects() {
  return (
    <section id="projects" className="w-full py-24 px-0 md:px-5">
      {/* ── Section header */}
      <div className="mb-10 text-center">
        <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
          Работа, <span className="font-light italic text-black/40">която говори</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-stone-500 font-light leading-relaxed">
          Разгледайте част от нашите реализирани проекти, които показват нашия подход към дизайна и функционалността.
        </p>
      </div>

      {/* ── Cards grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* ── CTA button */}
      <div className="mt-16 flex justify-center">
        <Link
          to="/projects"
          className="group flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white font-medium transition-all duration-300 hover:bg-stone-800 hover:shadow-lg"
        >
          Виж всички проекти
          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
