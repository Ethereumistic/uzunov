/**
 * Returns a localized value from a bilingual document.
 * For locale "en", returns `doc[field_en]` if it exists and is non-empty,
 * otherwise falls back to `doc[field_bg]`.
 * For locale "bg", returns `doc[field_bg]`.
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
 * Type helper: extracts locale-specific field names from a type.
 * E.g., LocalizedField<"title", "bg"> = "title_bg"
 */
export type LocalizedField<
  T extends string,
  L extends "bg" | "en"
> = `${T}_${L}`;

/**
 * Checks if a bilingual field has an English translation available.
 */
export function hasEnValue<T extends Record<string, unknown>>(
  doc: T,
  fieldBase: string
): boolean {
  const enValue = doc[`${fieldBase}_en`];
  return typeof enValue === "string" && enValue.trim() !== "";
}