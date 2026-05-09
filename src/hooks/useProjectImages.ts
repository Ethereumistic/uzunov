import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { ProjectImage } from "#/types/project";

/**
 * Resolve a single image URL from storageId or url_legacy fallback.
 */
export function useImageUrl(storageId: string | undefined): string | undefined {
  const url = useQuery(
    storageId
      ? api.images.getImageUrl
      : ("skip" as any),
    storageId
      ? { storageId: storageId as Id<"_storage"> }
      : ("skip" as any),
  );
  return (url ?? undefined) as string | undefined;
}

/**
 * Resolve all image URLs for a project's images array.
 * Uses batch query for efficiency.
 */
export function useProjectImageUrls(images: Array<{
  storageId?: Id<"_storage"> | string;
  url_legacy?: string;
}>): (string | undefined)[] {
  const storageIds = images
    .map((img) => img.storageId)
    .filter((id): id is Id<"_storage"> => !!id);

  const urlMap = useQuery(
    storageIds.length > 0
      ? api.images.getImageUrls
      : ("skip" as any),
    storageIds.length > 0
      ? { storageIds }
      : ("skip" as any),
  ) as Record<string, string | null> | undefined;

  return images.map((img) => {
    if (img.storageId && urlMap) {
      return urlMap[img.storageId] ?? img.url_legacy;
    }
    return img.url_legacy;
  });
}

/**
 * Synchronous helper: returns url_legacy for images without storageId.
 * For storageId-based images, use the hooks above.
 */
export function resolveImageUrl(image: ProjectImage): string {
  return image.url_legacy ?? "";
}