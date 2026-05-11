import { getLocale, setLocale, localizeUrl } from "../paraglide/runtime";
import { useCallback, useState } from "react";

const FLAGS: Record<string, { src: string; label: string }> = {
  bg: {
    src: "https://flagcdn.com/32x24/bg.webp",
    label: "БГ",
  },
  en: {
    src: "https://flagcdn.com/32x24/us.webp",
    label: "EN",
  },
};

const LOCALES = ["bg", "en"] as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = getLocale();
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback(
    (newLocale: "bg" | "en") => {
      if (newLocale === locale) {
        setOpen(false);
        return;
      }

      // Set locale in cookie and global variable
      setLocale(newLocale, { reload: false });

      // Calculate the localized URL
      const localizedUrl = localizeUrl(window.location.href, { locale: newLocale });

      // Navigate to the localized URL (this will trigger a full page load)
      window.location.href = localizedUrl.href;
    },
    [locale]
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors hover:bg-white/10"
        aria-label={`Current language: ${locale === "bg" ? "Bulgarian" : "English"}`}
      >
        <img
          src={FLAGS[locale].src}
          alt={`${locale} flag`}
          className="w-5 h-auto rounded-sm object-contain"
          width={24}
          height={16}
        />
        <span className="text-xs font-medium uppercase tracking-wide">
          {FLAGS[locale].label}
        </span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 min-w-[140px]">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${locale === l
                  ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
              >
                <img
                  src={FLAGS[l].src}
                  alt={`${l} flag`}
                  className="w-5 h-auto rounded-sm object-contain"
                  width={24}
                  height={16}
                />
                <span>{l === "bg" ? "Български" : "English"}</span>
                {locale === l && (
                  <svg className="w-4 h-4 ml-auto text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}