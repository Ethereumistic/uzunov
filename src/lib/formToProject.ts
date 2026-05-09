import type { ProjectFormState } from "#/types/project-form";
import type { Project } from "#/types/project";

/**
 * Convert form state to a Project-like object for the live preview.
 * Form uses strings for area/number fields; the preview needs numbers.
 */
export function formToProject(
  form: ProjectFormState,
  _locale: "bg" | "en",
): Project {
  return {
    _id: "preview",
    slug: form.slug,
    title_bg: form.title_bg,
    title_en: form.title_en,
    description_bg: form.description_bg || undefined,
    description_en: form.description_en || undefined,
    location_bg: form.location_bg,
    location_en: form.location_en,
    investor_bg: form.investor_bg,
    investor_en: form.investor_en,
    category: form.category,
    area: form.area ? parseFloat(form.area) : undefined,
    completionDate: form.completionDate || undefined,
    featured: form.featured,
    status: form.status,
    awards: form.awards,
    details: form.details.map((d) => ({
      name_bg: d.name_bg,
      name_en: d.name_en,
      area: parseFloat(d.area) || 0,
    })),
    images: form.images.map((img) => ({
      storageId: img.storageId,
      ar: img.ar,
      url_legacy: img.url_legacy,
    })),
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}