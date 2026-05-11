import { getLocale, setLocale } from "../paraglide/runtime";
import { cn } from "../lib/utils";

const FLAGS = {
  bg: "https://flagcdn.com/32x24/bg.webp",
  en: "https://flagcdn.com/32x24/us.webp",
} as const;

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = getLocale();

  function toggle() {
    const next = locale === "bg" ? "en" : "bg";
    setLocale(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={locale === "bg" ? "Switch to English" : "Превключване на български"}
      className={cn(
        "relative flex items-center justify-center size-9 rounded-full transition-colors duration-200",
        "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
    >
      <img
        src={FLAGS.bg}
        alt="БГ"
        width={24}
        height={16}
        className={cn(
          "aspect-video w-5 rounded-[2px] object-cover transition-all duration-300",
          locale === "bg"
            ? "rotate-0 scale-100 opacity-100"
            : "absolute rotate-90 scale-0 opacity-0"
        )}
      />
      <img
        src={FLAGS.en}
        alt="EN"
        width={24}
        height={16}
        className={cn(
          "aspect-video w-5 rounded-[2px] object-cover transition-all duration-300",
          locale === "en"
            ? "rotate-0 scale-100 opacity-100"
            : "absolute -rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
