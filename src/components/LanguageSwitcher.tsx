import { getLocale, setLocale } from "../paraglide/runtime";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useState } from "react";

const FLAGS: Record<string, { src: string; label: string }> = {
  bg: {
    src: "https://flagcdn.com/w40/bg.png",
    label: "БГ",
  },
  en: {
    src: "https://flagcdn.com/w40/en.png",
    label: "EN",
  },
};

const LOCALES = ["bg", "en"] as const;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = getLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) {
        setOpen(false);
        return;
      }
      setLocale(newLocale);

      // Get current path and compute the new localized URL
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search + window.location.hash
          : "/";

      // Compute the new path:
      // If switching to EN, we need to add /en prefix
      // If switching to BG, we need to remove /en prefix
      let newPath: string;
      if (newLocale === "en") {
        // Remove any existing /en prefix first, then add it
        const basePath = currentPath.replace(/^\/en(\/|$)/, "/");
        const normalizedPath = basePath === "/" ? "" : basePath;
        newPath = `/en${normalizedPath}` || "/en";
        if (!newPath.endsWith("/") && !newPath.includes("?")) {
          // keep as-is
        }
      } else {
        // Remove /en prefix
        newPath = currentPath.replace(/^\/en(\/|$)/, "/");
        // Normalize: replace // with /
        newPath = newPath.replace(/\/\//g, "/");
        if (newPath === "") newPath = "/";
      }

      // Preserve search and hash
      if (typeof window !== "undefined") {
        const search = window.location.search;
        const hash = window.location.hash;
        if (search && !newPath.includes(search)) newPath += search;
        if (hash && !newPath.includes(hash)) newPath += hash;
      }

      setOpen(false);
      router.navigate({ href: newPath, replace: false });
    },
    [locale, router]
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
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  locale === l
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