import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { Id } from "../../../convex/_generated/dataModel"

interface ProjectImageProps {
  image: {
    storageId?: Id<"_storage">
    ar: "L" | "S" | "V"
    url_legacy?: string
  }
  alt: string
  className?: string
  onClick?: () => void
}

/**
 * Renders a project image from either Convex storage or a legacy CDN URL.
 * Priority: Convex storage URL → legacy CDN URL → placeholder
 */
export function ProjectImage({ image, alt, className, onClick }: ProjectImageProps) {
  // Fetch Convex storage URL only if storageId exists
  const shouldFetch = image.storageId !== undefined
  const imageUrl = useQuery(
    shouldFetch ? api.images.getImageUrl : "skip" as any,
    shouldFetch ? { storageId: image.storageId! } : "skip" as any,
  )

  // Priority: Convex storage URL → legacy CDN URL → empty string
  const src = (shouldFetch ? imageUrl : undefined) ?? image.url_legacy ?? ""

  if (!src) {
    return (
      <div className={`${className ?? ""} bg-stone-100 flex items-center justify-center`}>
        <span className="text-5xl opacity-10">◻</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className ?? ""}
      onClick={onClick}
    />
  )
}