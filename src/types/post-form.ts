export interface PostFormState {
  slug: string;
  title_bg: string;
  title_en: string;
  body_bg: string;
  body_en: string;
  excerpt_bg: string;
  excerpt_en: string;
  coverImage: string; // storageId
  images: Array<{ storageId?: string; url_legacy?: string }>;
  published: boolean;
  displayDate: string; // YYYY-MM-DD
  order: number;
}

export const emptyPostFormState: PostFormState = {
  slug: "",
  title_bg: "",
  title_en: "",
  body_bg: "",
  body_en: "",
  excerpt_bg: "",
  excerpt_en: "",
  coverImage: "",
  images: [],
  published: false,
  displayDate: new Date().toISOString().split("T")[0], // today's date by default
  order: 0,
};