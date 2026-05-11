import type { Post } from "#/types/post";
import type { PostFormState } from "#/types/post-form";

/**
 * Convert a Post document to form state for editing.
 */
export function postToForm(post: Post): PostFormState {
  return {
    slug: post.slug,
    title_bg: post.title_bg,
    title_en: post.title_en ?? "",
    body_bg: post.body_bg,
    body_en: post.body_en ?? "",
    excerpt_bg: post.excerpt_bg ?? "",
    excerpt_en: post.excerpt_en ?? "",
    coverImage: post.coverImage ?? "",
    images: post.images.map((img: { storageId?: string; url_legacy?: string }) => ({
      storageId: img.storageId as string | undefined,
      url_legacy: img.url_legacy,
    })),
    published: post.published,
    displayDate: post.displayDate,
    order: post.order,
  };
}