import type { Doc } from "../../convex/_generated/dataModel";

/** A Convex project document type */
export type ProjectDoc = Doc<"projects">;

/** Category literal values */
export type ProjectCategory = ProjectDoc["category"];

/** Status literal values */
export type ProjectStatus = ProjectDoc["status"];

/** Image aspect ratio type */
export type ImageAR = "L" | "S" | "V";

/** All categories including "All" filter option */
export type ProjectCategoryFilter = "All" | ProjectCategory;

/** A single project image */
export interface ProjectImage {
  storageId?: string;
  ar: ImageAR;
  url_legacy?: string;
}

/** A project award */
export interface ProjectAward {
  text_bg: string;
  text_en: string;
}

/** A sub-building detail */
export interface ProjectDetail {
  name_bg: string;
  name_en: string;
  area: number;
}

/** Full project type — used across public pages and admin */
export interface Project {
  _id: string;
  slug: string;
  title_bg: string;
  title_en: string;
  description_bg?: string;
  description_en?: string;
  location_bg: string;
  location_en: string;
  investor_bg: string;
  investor_en: string;
  category: ProjectCategory;
  area?: number;
  completionDate?: string;
  featured: boolean;
  status: ProjectStatus;
  awards: ProjectAward[];
  images: ProjectImage[];
  details?: ProjectDetail[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

/** Category display labels (Bulgarian) */
export const categoryLabels: Record<ProjectCategoryFilter, string> = {
  All: "Всички",
  Office: "Офиси",
  Healthcare: "Здравеопазване",
  Commercial: "Търговски",
  Industrial: "Индустриални",
  Residential: "Жилищни",
  Interior: "Интериор",
};

/** All category filter options */
export const allCategories: ProjectCategoryFilter[] = [
  "All",
  "Office",
  "Healthcare",
  "Commercial",
  "Industrial",
  "Residential",
  "Interior",
];