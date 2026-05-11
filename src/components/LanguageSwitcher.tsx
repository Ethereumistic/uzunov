import { getLocale, setLocale } from "../paraglide/runtime";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

  const switchLocale = (newLocale: "bg" | "en") => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 px-2 ${className}`}
          aria-label={`Current language: ${locale === "bg" ? "Bulgarian" : "English"}`}
        >
          <img
            src={FLAGS[locale].src}
            alt={`${locale} flag`}
            className="w-5 h-auto rounded-sm object-contain"
            width={24}
            height={16}
          />
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => switchLocale(l)}
            className={`flex items-center gap-2 ${
              locale === l
                ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-medium focus:bg-teal-50 dark:focus:bg-teal-900/30 focus:text-teal-700 dark:focus:text-teal-300"
                : ""
            }`}
          >
            <img
              src={FLAGS[l].src}
              alt={`${l} flag`}
              className="w-5 h-auto rounded-sm object-contain"
              width={24}
              height={16}
            />
            <span>{l === "bg" ? "BG" : "EN"}</span>
            {locale === l && (
              <svg
                className="w-4 h-4 ml-auto text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
