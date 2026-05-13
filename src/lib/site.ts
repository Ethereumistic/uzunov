export const SITE_URL = (
  (import.meta as any).env?.VITE_SITE_URL as string
) || "";
export const SITE_NAME = "Узунов Проект";
export const DEFAULT_TITLE = `${SITE_NAME} — Архитектурно студио`;
export const DEFAULT_DESCRIPTION =
  "Архитектурно студио Узунов Проект предлага проектиране на сгради и съоръжения, интериорен дизайн, консултации и управление на проекти в София и цяла България.";
export const DEFAULT_IMAGE = "/android-chrome-512x512.png";
export const DEFAULT_LOCALE = "bg_BG";
export const SITE_KEYWORDS =
  "архитектурно студио, проектиране, сгради, интериорен дизайн, консултации, управление на проекти, София, България";
