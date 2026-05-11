// Type declarations for paraglide generated files

// Paraglide runtime module
declare module "*/paraglide/runtime" {
  export const baseLocale: "bg" | "en";
  export const locales: readonly ["bg", "en"];
  export const cookieName: string;
  export const strategy: Array<"cookie" | "baseLocale" | "globalVariable" | "url" | "preferredLanguage" | "localStorage">;

  export function getLocale(): "bg" | "en";
  export function setLocale(newLocale: "bg" | "en", options?: { reload?: boolean }): void;
  export function getLocaleForUrl(url: string | URL): "bg" | "en";
  export function localizeUrl(url: string | URL, options?: { locale?: "bg" | "en" }): URL;
  export function deLocalizeUrl(url: string | URL): URL;
  export function localizeHref(href: string, options?: { locale?: "bg" | "en" }): string;
  export function getTextDirection(locale?: string): "ltr" | "rtl";
  export function isLocale(locale: unknown): locale is "bg" | "en";
  export function extractLocaleFromRequest(request: Request, options?: { effectiveRequestUrl?: string | URL }): "bg" | "en";
  export function shouldRedirect(input?: { request?: Request; url?: string | URL; locale?: "bg" | "en"; effectiveRequestUrl?: string | URL }): Promise<{
    shouldRedirect: boolean;
    locale: "bg" | "en";
    redirectUrl?: URL;
  }>;
  export function overwriteSetLocale(fn: (newLocale: "bg" | "en", options?: { reload?: boolean }) => void | Promise<void>): void;
}

// Paraglide messages module
declare module "*/paraglide/messages" {
  export type MessageFunction<T = undefined> = (inputs?: T) => string;

  export interface MessageDict {
    "nav.home": MessageFunction;
    "nav.about": MessageFunction;
    "nav.projects": MessageFunction;
    "nav.blog": MessageFunction;
    "nav.services": MessageFunction;
    "nav.contact": MessageFunction;
    "logo.alt": MessageFunction;
    "logo.text": MessageFunction;
    "hero.headline.line1": MessageFunction;
    "hero.headline.line2": MessageFunction;
    "hero.subtitle.line1": MessageFunction;
    "hero.subtitle.line2": MessageFunction;
    "hero.cta.projects": MessageFunction;
    "hero.cta.contact": MessageFunction;
    "hero.stats.years.label": MessageFunction;
    "hero.stats.projects.label": MessageFunction;
    "hero.stats.facade.label": MessageFunction;
    "hero.stats.building.label": MessageFunction;
    "aria.slides": MessageFunction<{ number: number }>;
    "aria.slide": MessageFunction<{ number: number }>;
    "aria.visualpanel1": MessageFunction;
    "aria.menutoggle1": MessageFunction;
    "aria.close": MessageFunction;
    "aria.image": MessageFunction<{ photo: string }>;
    "aria.previous": MessageFunction;
    "aria.next": MessageFunction;
    "footer.motto": MessageFunction;
    "footer.studio": MessageFunction;
    "footer.contacts": MessageFunction;
    "footer.services": MessageFunction;
    "footer.copyright": MessageFunction<{ year: number; studio: string }>;
    "footer.privacy": MessageFunction;
    "footer.terms": MessageFunction;
    "footer.developedby1": MessageFunction;
    "services.architecture.title": MessageFunction;
    "services.architecture.description": MessageFunction;
    "services.urban.title": MessageFunction;
    "services.urban.description": MessageFunction;
    "services.engineering.title": MessageFunction;
    "services.engineering.description": MessageFunction;
    "services.consulting.title": MessageFunction;
    "services.consulting.description": MessageFunction;
    "services.3d.title": MessageFunction;
    "services.3d.description": MessageFunction;
    "services.projectManagement.title": MessageFunction;
    "services.projectManagement.description": MessageFunction;
    "services.sectiontitle1": MessageFunction;
    "services.otherservices1": MessageFunction;
    "about.title": MessageFunction;
    "about.philosophy": MessageFunction;
    "about.philosophy.text": MessageFunction;
    "about.vision": MessageFunction;
    "about.vision.text": MessageFunction;
    "about.mission": MessageFunction;
    "about.mission.text": MessageFunction;
    "project.year": MessageFunction;
    "project.area": MessageFunction<{ sqm: number }>;
    "project.location": MessageFunction;
    "project.investor": MessageFunction;
    "project.photos": MessageFunction<{ n: number }>;
    "project.awards": MessageFunction;
    "project.award": MessageFunction<{ award: string }>;
    "project.status.completed": MessageFunction;
    "project.status.inProgress": MessageFunction;
    "projects.title": MessageFunction;
    "projects.subtitle": MessageFunction;
    "projects.featured.title": MessageFunction;
    "projects.featured.description": MessageFunction;
    "projects.otherProjects": MessageFunction;
    "projects.viewAll": MessageFunction;
    "projects.backToProjects": MessageFunction;
    "projects.empty": MessageFunction;
    "projects.notFound": MessageFunction;
    "categories.residential": MessageFunction;
    "categories.commercial": MessageFunction;
    "categories.interior": MessageFunction;
    "categories.office": MessageFunction;
    "categories.healthcare": MessageFunction;
    "categories.industrial": MessageFunction;
    "blog.title": MessageFunction;
    "blog.subtitle": MessageFunction;
    "blog.empty": MessageFunction;
    "blog.notFound": MessageFunction;
    "blog.onlyBulgarian": MessageFunction;
    "blog.readMore": MessageFunction;
    "blog.backToBlog": MessageFunction;
    "contact.title": MessageFunction;
    "contact.description": MessageFunction;
    "contact.nameLabel": MessageFunction;
    "contact.namePlaceholder": MessageFunction;
    "contact.emailLabel": MessageFunction;
    "contact.phoneLabel": MessageFunction;
    "contact.messageLabel": MessageFunction;
    "contact.send": MessageFunction;
    "contact.sent": MessageFunction;
    "contact.visitUs": MessageFunction;
    "contact.writeUs": MessageFunction;
    "contact.address": MessageFunction;
    "contact.addressCity": MessageFunction;
    "contact.openMap": MessageFunction;
    "cta.contactUs": MessageFunction;
    "cta.haveIdea": MessageFunction;
    "cta.contactConsultation": MessageFunction;
    "numbers.title": MessageFunction;
    "numbers.description": MessageFunction;
    "numbers.years": MessageFunction<{ n: number }>;
    "numbers.projectsCount": MessageFunction<{ n: number }>;
    "numbers.clients": MessageFunction<{ n: number }>;
    "languageSwitcher.bulgarian": MessageFunction;
    "languageSwitcher.english": MessageFunction;
    "legal.privacy.title": MessageFunction;
    "legal.terms.title": MessageFunction;
    "legal.onlyBulgarian": MessageFunction;
    [key: string]: MessageFunction;
  }

  const m: MessageDict;
  export { m };
  export * as m from './messages/_index.js';
  export * from './messages/_index.js';
}