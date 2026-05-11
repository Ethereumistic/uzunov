import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "../lib/utils"

function getStoredTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark") return stored
  return null
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function getResolvedTheme(): "light" | "dark" {
  const stored = getStoredTheme()
  if (stored) return stored
  return getSystemTheme()
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
  root.style.colorScheme = theme
}

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // Read theme from DOM on mount to avoid hydration mismatch
  // The THEME_INIT_SCRIPT in __root.tsx already set the correct theme before this mounts
  const [resolved, setResolved] = React.useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    // Read from DOM classList to match what THEME_INIT_SCRIPT applied
    const root = document.documentElement
    if (root.classList.contains("dark")) return "dark"
    if (root.classList.contains("light")) return "light"
    // Fallback: compute it ourselves
    return getResolvedTheme()
  })

  // After hydration, re-sync state with the actual DOM.
  // The THEME_INIT_SCRIPT sets the theme before React hydrates, but hydration
  // reconciliation may wipe the class/style. This runs before paint to correct
  // any mismatch between ThemeToggle state and the real DOM.
  React.useLayoutEffect(() => {
    const root = document.documentElement
    const actual: "light" | "dark" = root.classList.contains("dark")
      ? "dark"
      : root.classList.contains("light")
        ? "light"
        : getSystemTheme()

    // If DOM lost the theme class during hydration, re-apply it
    if (!root.classList.contains(actual)) {
      applyTheme(actual)
    }
    setResolved(actual)
  }, [])

  // Keep in sync with system changes when no explicit preference is stored
  React.useEffect(() => {
    const stored = getStoredTheme()
    if (stored) return // user has explicit preference, no need to listen

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const sys = getSystemTheme()
      setResolved(sys)
      applyTheme(sys)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  function toggle() {
    const next: "light" | "dark" = resolved === "dark" ? "light" : "dark"
    setResolved(next)
    applyTheme(next)
    window.localStorage.setItem("theme", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex items-center justify-center size-9 rounded-full transition-colors duration-200",
        "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
    >
      <Sun
        className={cn(
          "size-[18px] transition-all duration-300",
          resolved === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "absolute rotate-90 scale-0 opacity-0"
        )}
      />
      <Moon
        className={cn(
          "size-[18px] transition-all duration-300",
          resolved === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "absolute -rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  )
}

export default ThemeToggle