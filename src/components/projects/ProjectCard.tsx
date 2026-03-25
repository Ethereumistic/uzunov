import { Link } from "@tanstack/react-router"
import {
  Building2,
  Hospital,
  ShoppingBag,
  Factory,
  type LucideIcon,
} from "lucide-react"
import { cn } from "#/lib/utils"
import {
  type Project,
} from "#/data/projects"

const categoryIcons: Record<string, LucideIcon> = {
  Office: Building2,
  Healthcare: Hospital,
  Commercial: ShoppingBag,
  Industrial: Factory,
}

function NoImagePlaceholder({ category }: { category: string }) {
  const colours: Record<string, string> = {
    Office: "from-sky-300 to-sky-500",
    Healthcare: "from-emerald-300 to-emerald-500",
    Commercial: "from-amber-300 to-amber-500",
    Industrial: "from-slate-400 to-slate-600",
  }
  return (
    <div
      className={cn(
        "w-full h-full bg-linear-to-br flex items-center justify-center",
        colours[category] ?? "from-stone-300 to-stone-500"
      )}
    >
      <span className="text-6xl opacity-20">◻</span>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasImage = project.images.length > 0
  const CategoryIcon = categoryIcons[project.category] || Building2

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group relative h-[440px] w-full overflow-hidden rounded-3xl border-0 bg-transparent flex flex-col justify-end transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)]"
    >
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full overflow-hidden">
          {hasImage ? (
            <img
              src={project.images[0].url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-2000 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full transition-transform duration-2000 ease-out group-hover:scale-105">
              <NoImagePlaceholder category={project.category} />
            </div>
          )}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/95 transition-opacity duration-700" />
      </div>

      {/* Content block */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col w-full h-full justify-end overflow-hidden">
        <div className="flex items-center gap-4 transition-all duration-300">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14">
            <CategoryIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-md leading-tight">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
