import type { Project } from "#/types/project";
import type { ProjectFormState } from "#/types/project-form";

/**
 * Convert a Project document to form state for editing.
 * Number fields are converted to strings for form inputs.
 */
export function projectToForm(project: Project): ProjectFormState {
  return {
    slug: project.slug,
    title_bg: project.title_bg,
    title_en: project.title_en,
    description_bg: project.description_bg ?? "",
    description_en: project.description_en ?? "",
    location_bg: project.location_bg,
    location_en: project.location_en,
    investor_bg: project.investor_bg,
    investor_en: project.investor_en,
    category: project.category,
    area: project.area?.toString() ?? "",
    completionDate: project.completionDate ?? "",
    featured: project.featured,
    status: project.status,
    awards: project.awards.map((a) => ({ text_bg: a.text_bg, text_en: a.text_en })),
    details:
      project.details?.map((d) => ({
        name_bg: d.name_bg,
        name_en: d.name_en,
        area: d.area.toString(),
      })) ?? [],
    images: project.images.map((img) => ({
      storageId: img.storageId as string | undefined,
      ar: img.ar,
      url_legacy: img.url_legacy,
    })),
  };
}