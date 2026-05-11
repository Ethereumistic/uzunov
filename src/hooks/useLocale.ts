import { useRouter } from "@tanstack/react-router";
import { getLocale, setLocale } from "../paraglide/runtime";

/**
 * Hook that returns the current locale from Paraglide's runtime.
 * Use this in any component that needs to know the current language.
 */
export function useLocale(): "bg" | "en" {
  return getLocale() as "bg" | "en";
}

/**
 * Returns a localized value from a bilingual object.
 * Picks `field_en` when locale is "en", falls back to `field_bg` if the EN value is missing.
 */
export function getLocalizedValue<T extends Record<string, unknown>>(
  doc: T,
  fieldBase: string,
  locale: "bg" | "en"
): string {
  if (locale === "en") {
    const enValue = doc[`${fieldBase}_en`];
    if (typeof enValue === "string" && enValue.trim() !== "") {
      return enValue;
    }
  }
  const bgValue = doc[`${fieldBase}_bg`];
  return typeof bgValue === "string" ? bgValue : "";
}

/**
 * Switches the locale and navigates to the localized URL.
 */
export function useSwitchLocale() {
  const router = useRouter();

  return (newLocale: "bg" | "en") => {
    setLocale(newLocale);
    // Force React to re-render with new locale
    router.invalidate();
  };
}