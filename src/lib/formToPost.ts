import type { PostFormState } from "#/types/post-form";
import type { Post } from "#/types/post";

/**
 * Convert form state to a Post-like object for live preview.
 */
export function formToPost(form: PostFormState, _locale: "bg" | "en"): Post {
  return {
    _id: "preview",
    slug: form.slug,
    title_bg: form.title_bg,
    title_en: form.title_en || undefined,
    body_bg: form.body_bg,
    body_en: form.body_en || undefined,
    excerpt_bg: form.excerpt_bg || undefined,
    excerpt_en: form.excerpt_en || undefined,
    coverImage: form.coverImage || undefined,
    images: form.images.map((img: { storageId?: string; url_legacy?: string }) => ({
      storageId: img.storageId,
      url_legacy: img.url_legacy,
    })),
    published: form.published,
    displayDate: form.displayDate,
    order: 0,
    _creationTime: Date.now(),
  };
}