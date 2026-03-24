import { Link } from "@tanstack/react-router"
import { Trophy } from "lucide-react"
import { Badge } from "#/components/ui/badge"
import { cn } from "#/lib/utils"
import {
  categoryLabels,
  type Project,
} from "#/data/projects"

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
        "w-full h-full bg-gradient-to-br flex items-center justify-center",
        colours[category] ?? "from-stone-100 to-stone-50"
      )}
    >
      <span className="text-4xl opacity-20">◻</span>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasImage = project.images.length > 0

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-3xl border border-white/40 bg-stone-100 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60"
    >
      {hasImage ? (
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-[2100ms] ease-out group-hover:scale-105"
        />
      ) : (
        <NoImagePlaceholder category={project.category} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-sm font-semibold leading-snug text-white line-clamp-2 drop-shadow-lg">
          {project.title}
        </h3>
      </div>

      <div className="absolute top-4 left-4 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0">
        <Badge variant="glass">
          {categoryLabels[project.category]}
        </Badge>
      </div>

      {project.awards.length > 0 && (
        <div className="absolute top-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-[-8px] group-hover:translate-y-0">
          <Badge variant="glass-gold" className="gap-1.5">
            <Trophy size={10} />
            Награда
          </Badge>
        </div>
      )}
    </Link>
  )
}
