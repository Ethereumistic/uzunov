import type { Doc } from "../../convex/_generated/dataModel";

/** A Convex post document type */
export type PostDoc = Doc<"posts">;

/** A single post image — simpler than project images (no AR) */
export interface PostImage {
  storageId?: string;
  url_legacy?: string;
}

/** Full post type — used across public pages and admin */
export interface Post {
  _id: string;
  slug: string;
  title_bg: string;
  title_en?: string;
  body_bg: string;
  body_en?: string;
  excerpt_bg?: string;
  excerpt_en?: string;
  coverImage?: string;
  images: PostImage[];
  published: boolean;
  displayDate: string;
  order: number;
  _creationTime: number;
}