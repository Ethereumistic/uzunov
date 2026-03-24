export interface ProjectDetail {
  name: string
  area: number
}

export interface Project {
  id: string
  title: string
  category: "Office" | "Healthcare" | "Commercial" | "Industrial"
  location: string
  area: number | null
  investor: string
  completionDate: string | null
  featured: boolean
  status: "done" | "in-progress"
  awards: string[]
  images: string[]
  description?: string
  details?: ProjectDetail[]
}

export type ProjectCategory = "All" | Project["category"]

import rawProjects from "./projects.json"

export const projects = rawProjects as Project[]

export const featuredProjects = projects.filter((p) => p.featured && p.images.length > 0)

export const allCategories: ProjectCategory[] = [
  "All",
  "Office",
  "Healthcare",
  "Commercial",
  "Industrial",
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  if (category === "All") return projects
  return projects.filter((p) => p.category === category)
}

export const categoryLabels: Record<ProjectCategory, string> = {
  All: "Всички",
  Office: "Офиси",
  Healthcare: "Здравеопазване",
  Commercial: "Търговски",
  Industrial: "Индустриални",
}
