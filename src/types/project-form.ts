import type { ProjectCategory, ProjectStatus, ImageAR } from "./project";

export interface ProjectFormState {
  slug: string;
  title_bg: string;
  title_en: string;
  description_bg: string;
  description_en: string;
  location_bg: string;
  location_en: string;
  investor_bg: string;
  investor_en: string;
  category: ProjectCategory;
  area: string; // string in form, parsed to number on save
  completionDate: string; // ISO date string
  featured: boolean; // true = has featuredOrder, false = not featured
  status: ProjectStatus;
  awards: Array<{ text_bg: string; text_en: string }>;
  details: Array<{ name_bg: string; name_en: string; area: string }>;
  images: Array<{ storageId?: string; ar: ImageAR; url_legacy?: string }>;
}

export const emptyFormState: ProjectFormState = {
  slug: "",
  title_bg: "",
  title_en: "",
  description_bg: "",
  description_en: "",
  location_bg: "",
  location_en: "",
  investor_bg: "",
  investor_en: "",
  category: "Office",
  area: "",
  completionDate: "",
  featured: false,
  status: "done",
  awards: [],
  details: [],
  images: [],
};