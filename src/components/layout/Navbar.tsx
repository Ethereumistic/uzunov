import * as React from "react"
import { Logo } from "./Logo"
import { cn } from "../../lib/utils"
import {
    Building2,
    Map,
    Cog,
    MessageSquare,
    Box,
    ClipboardCheck,
    Menu,
    X,
    ChevronDown,
    Search,
    FolderKanban,
    FileText,
    ArrowRight,
} from 'lucide-react'
import { Link } from "@tanstack/react-router"
import { ThemeToggle } from "../ThemeToggle"
import { LanguageSwitcher } from "../LanguageSwitcher"
import { m } from "../../paraglide/messages"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { getLocale } from "#/paraglide/runtime"

const serviceItems = [
    {
        titleKey: "services.architecture.title",
        icon: <Building2 className="size-6 text-foreground" />,
        href: "/services/architecture"
    },
    {
        titleKey: "services.urban.title",
        icon: <Map className="size-6 text-foreground" />,
        href: "/services/urban"
    },
    {
        titleKey: "services.engineering.title",
        icon: <Cog className="size-6 text-foreground" />,
        href: "/services/engineering"
    },
    {
        titleKey: "services.consulting.title",
        icon: <MessageSquare className="size-6 text-foreground" />,
        href: "/services/consulting"
    },
    {
        titleKey: "services.3d.title",
        icon: <Box className="size-6 text-foreground" />,
        href: "/services/3d"
    },
    {
        titleKey: "services.projectManagement.title",
        icon: <ClipboardCheck className="size-6 text-foreground" />,
        href: "/services/projects"
    },
]

export function Navbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [servicesOpen, setServicesOpen] = React.useState(false)
    const [hoveredNav, setHoveredNav] = React.useState<string | null>(null)
    const navRef = React.useRef<HTMLDivElement>(null)
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Search state ──
    const [searchOpen, setSearchOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [debouncedQuery, setDebouncedQuery] = React.useState("")
    const searchInputRef = React.useRef<HTMLInputElement>(null)
    const searchResultsRef = React.useRef<HTMLDivElement>(null)

    // Debounce the search query — 300ms
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Convex query — backend returns [] for queries < 2 chars, so always safe to call.
    // Client-side 300ms debounce already limits call frequency.
    const convexResults = useQuery(api.search.search, { query: debouncedQuery, limit: 6 })

    // Client-side service search
    const serviceResults = React.useMemo(() => {
        if (debouncedQuery.length < 2) return []
        const term = debouncedQuery.toLowerCase()
        return serviceItems.filter((s) => {
            const title = m[s.titleKey as keyof typeof m]()
            return title.toLowerCase().includes(term)
        }).map((s) => ({
            type: "service" as const,
            title: m[s.titleKey as keyof typeof m](),
            href: s.href,
            icon: s.icon,
        }))
    }, [debouncedQuery])

    // Merge and limit to 3 results total
    const combinedResults = React.useMemo(() => {
        if (!convexResults) return serviceResults.slice(0, 3).map(s => ({ ...s, subtitle: undefined }))
        const all: Array<{
            type: string
            title: string
            href: string
            icon?: React.ReactNode
            subtitle?: string
        }> = []

        // Services first (instant, local)
        for (const s of serviceResults) {
            if (all.length >= 3) break
            all.push({ ...s, subtitle: undefined })
        }

        // Then Convex results (projects + posts)
        const locale = getLocale()
        for (const r of convexResults) {
            if (all.length >= 3) break
            if (r.type === "project") {
                all.push({
                    type: "project",
                    title: locale === "bg" ? r.title_bg : (r.title_en || r.title_bg),
                    href: `/projects/${r.slug}`,
                    icon: <FolderKanban className="size-4 text-foreground/60" />,
                    subtitle: r.category,
                })
            } else if (r.type === "post") {
                all.push({
                    type: "post",
                    title: locale === "bg" ? r.title_bg : (r.title_en || r.title_bg),
                    href: `/blog/${r.slug}`,
                    icon: <FileText className="size-4 text-foreground/60" />,
                    subtitle: r.displayDate,
                })
            }
        }

        return all
    }, [convexResults, serviceResults])

    // Focus input when search opens
    React.useEffect(() => {
        if (searchOpen) {
            // Small delay so the DOM element exists
            requestAnimationFrame(() => searchInputRef.current?.focus())
        }
    }, [searchOpen])

    // Close search on Escape
    React.useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && searchOpen) {
                setSearchOpen(false)
                setSearchQuery("")
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [searchOpen])

    // Close search on outside click
    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                searchOpen &&
                navRef.current &&
                !navRef.current.contains(e.target as Node)
            ) {
                setSearchOpen(false)
                setSearchQuery("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [searchOpen])

    function closeSearch() {
        setSearchOpen(false)
        setSearchQuery("")
    }

    // Close menus on outside click
    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setServicesOpen(false)
                setMobileOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function handleServicesMouseEnter() {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        setServicesOpen(true)
    }

    function handleServicesMouseLeave() {
        closeTimerRef.current = setTimeout(() => {
            setServicesOpen(false)
        }, 120)
    }

    return (
        <header className="sticky top-5 -translate-y-3 md:translate-y-0 md:top-4 mt-8 mb-[-96px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ease-in-out">
            <div ref={navRef} className="w-full max-w-[22rem] sm:max-w-xl md:max-w-3xl xl:max-w-5xl 2xl:max-w-280 pointer-events-auto transition-all duration-300 relative h-[64px]">
                <div className="absolute top-0 left-0 right-0 px-6 rounded-3xl transition-all duration-300 ease-in-out border border-white/20 dark:border-white/[0.08] bg-gradient-to-b from-white/80 to-white/60 dark:from-[rgba(26,25,23,0.85)] dark:to-[rgba(26,25,23,0.7)] backdrop-blur-[15px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_40px_0_rgba(0,0,0,0.35)] saturate-150">

                    {/* Main bar */}
                    <div className="flex items-center justify-between h-[64px]">

                        {/* Logo */}
                        <div className="flex shrink-0 items-center -translate-x-2.5 dark:invert">
                            <Link to="/" className="transition-opacity">
                                <Logo type="horizontal" size="lg" variant="black" />
                            </Link>
                        </div>

                        {/* Desktop Navigation — hidden when search is active */}
                        <nav
                            className={cn(
                                "hidden xl:flex items-center gap-1 transition-all duration-300",
                                searchOpen && "opacity-0 pointer-events-none absolute"
                            )}
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <Link
                                to="/"
                                hash="about"
                                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                onMouseEnter={() => setHoveredNav("about")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase transition-all duration-150 select-none",
                                    hoveredNav === "about"
                                        ? "text-foreground"
                                        : hoveredNav === null
                                            ? "text-foreground/70"
                                            : "text-foreground/40"
                                )}
                            >
                                {m["nav.about"]()}
                            </Link>

                            <Link
                                to="/projects"
                                onMouseEnter={() => setHoveredNav("projects")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase transition-all duration-150 select-none",
                                    hoveredNav === "projects"
                                        ? "text-foreground"
                                        : hoveredNav === null
                                            ? "text-foreground/70"
                                            : "text-foreground/40"
                                )}
                            >
                                {m["nav.projects"]()}
                            </Link>

                            <Link
                                to="/blog"
                                onMouseEnter={() => setHoveredNav("blog")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase transition-all duration-150 select-none",
                                    hoveredNav === "blog"
                                        ? "text-foreground"
                                        : hoveredNav === null
                                            ? "text-foreground/70"
                                            : "text-foreground/40"
                                )}
                            >
                                {m["nav.blog"]()}
                            </Link>

                            {/* Services trigger */}
                            <div
                                onMouseEnter={() => { handleServicesMouseEnter(); setHoveredNav("services") }}
                                onMouseLeave={() => { handleServicesMouseLeave(); setHoveredNav(null) }}
                            >
                                <Link
                                    to="/"
                                    hash="services"
                                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                    className={cn(
                                        "inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold uppercase transition-all duration-150 select-none transition-colors",
                                        servicesOpen
                                            ? "text-foreground ring-1 ring-foreground/12 bg-foreground/[0.04]"
                                            : hoveredNav === "services"
                                                ? "text-foreground"
                                                : hoveredNav === null
                                                    ? "text-foreground/70"
                                                    : "text-foreground/40"
                                    )}
                                >
                                    {m["nav.services"]()}
                                    <ChevronDown
                                        className={cn(
                                            "size-3.5 transition-transform duration-300",
                                            servicesOpen && "rotate-180"
                                        )}
                                    />
                                </Link>
                            </div>
                        </nav>

                        {/* Desktop search input — shown when search is active */}
                        <div
                            className={cn(
                                "hidden xl:flex items-center flex-1 transition-all duration-300",
                                searchOpen
                                    ? "opacity-100 pointer-events-auto"
                                    : "opacity-0 pointer-events-none absolute w-0 h-0 overflow-hidden"
                            )}
                        >
                            <div className="relative flex-1 mr-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search projects, posts, services…"
                                    className="w-full h-9 pl-9 pr-4 rounded-xl border border-foreground/10 bg-foreground/[0.03] dark:bg-foreground/[0.06] backdrop-blur-sm text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-all"
                                />
                                {/* Results dropdown */}
                                {searchOpen && debouncedQuery.length >= 2 && (
                                    <div
                                        ref={searchResultsRef}
                                        className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-foreground/[0.08] bg-white/90 dark:bg-[rgba(26,25,23,0.95)] backdrop-blur-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                    >
                                        {combinedResults.length === 0 && convexResults !== undefined && (
                                            <div className="px-4 py-3 text-sm text-foreground/50 text-center">
                                                No results found
                                            </div>
                                        )}
                                        {combinedResults.map((result, i) => (
                                            <Link
                                                key={`${result.type}-${result.href}-${i}`}
                                                to={result.href as any}
                                                onClick={closeSearch}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.04] transition-colors group"
                                            >
                                                <div className="flex items-center justify-center size-8 rounded-lg bg-foreground/[0.04] shrink-0">
                                                    {result.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-foreground truncate">
                                                        {result.title}
                                                    </div>
                                                    {result.subtitle && (
                                                        <div className="text-xs text-foreground/50 capitalize">
                                                            {result.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 bg-foreground/[0.04] px-2 py-0.5 rounded-full">
                                                    {result.type}
                                                </span>
                                                <ArrowRight className="size-3.5 text-foreground/20 group-hover:text-foreground/50 transition-colors shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side: search + language switcher + theme toggle + CTA / hamburger */}
                        <div className="flex items-center -mr-3 gap-1">

                            {/* Desktop search toggle button */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (searchOpen) {
                                        closeSearch()
                                    } else {
                                        setSearchOpen(true)
                                        setServicesOpen(false)
                                    }
                                }}
                                className={cn(
                                    "hidden xl:flex items-center justify-center size-9 rounded-full transition-colors duration-200",
                                    "hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                                    searchOpen && "bg-foreground/[0.06]"
                                )}
                                aria-label="Search"
                            >
                                {searchOpen
                                    ? <X className="size-[18px] text-foreground" />
                                    : <Search className="size-[18px] text-foreground/70" />
                                }
                            </button>

                            <Link
                                to="/"
                                hash="contact"
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="hidden xl:inline-flex bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl text-sm font-bold uppercase hover:bg-primary/80 transition-all shadow-lg hover:shadow-primary/20"
                            >
                                {m["nav.contact"]()}
                            </Link>
                            <button
                                className="xl:hidden text-foreground rounded-full hover:bg-foreground/5 transition-colors p-2"
                                onClick={() => {
                                    setMobileOpen(prev => !prev)
                                    setServicesOpen(false)
                                }}
                                aria-label={m["aria.menuToggle"]()}
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <div className="hidden xl:flex">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Services Panel */}
                    <div
                        onMouseEnter={handleServicesMouseEnter}
                        onMouseLeave={handleServicesMouseLeave}
                        className={cn(
                            "hidden md:grid grid-cols-3 gap-3 overflow-hidden transition-all duration-300 ease-in-out",
                            servicesOpen
                                ? "max-h-[400px] opacity-100 pb-5 pt-1"
                                : "max-h-0 opacity-0 pb-0 pt-0 pointer-events-none"
                        )}
                    >
                        {serviceItems.map((service) => (
                            <Link
                                key={service.href}
                                to={service.href as any}
                                onClick={() => setServicesOpen(false)}
                                className="group flex items-center gap-4 rounded-2xl border border-foreground/[0.08] p-4 transition-all duration-200 hover:bg-foreground/[0.04] hover:border-foreground/20"
                            >
                                <div className="flex items-center justify-center size-11 rounded-xl bg-foreground/6 shrink-0 transition-transform group-hover:scale-105">
                                    {service.icon}
                                </div>
                                <span className="font-semibold text-[15px] text-foreground leading-tight">
                                    {m[service.titleKey as keyof typeof m]()}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Expanded Menu */}
                    <div
                        className={cn(
                            "xl:hidden overflow-hidden transition-all duration-300 ease-in-out",
                            mobileOpen
                                ? "max-h-[600px] opacity-100 pb-5 pt-3"
                                : "max-h-0 opacity-0 pb-0 pt-0 pointer-events-none"
                        )}
                    >
                        <nav className="flex flex-col gap-2.5 group/nav">
                            {/* Mobile search input */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/40 pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchOpen(true)}
                                    placeholder={m["search.placeholder"]()}
                                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-foreground/[0.08] dark:border-foreground/[0.16] bg-foreground/[0.04] dark:bg-foreground/[0.06] text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-all"
                                />
                                {/* Mobile results dropdown */}
                                {searchOpen && debouncedQuery.length >= 2 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-foreground/[0.08] bg-white/95 dark:bg-[rgba(26,25,23,0.95)] backdrop-blur-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                    >
                                        {combinedResults.length === 0 && convexResults !== undefined && (
                                            <div className="px-4 py-3 text-sm text-foreground/50 text-center">
                                                {m["search.noResults"]()}
                                            </div>
                                        )}
                                        {combinedResults.map((result, i) => (
                                            <Link
                                                key={`${result.type}-${result.href}-${i}`}
                                                to={result.href as any}
                                                onClick={() => { closeSearch(); setMobileOpen(false) }}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.04] transition-colors group"
                                            >
                                                <div className="flex items-center justify-center size-8 rounded-lg bg-foreground/[0.04] shrink-0">
                                                    {result.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-foreground truncate">
                                                        {result.title}
                                                    </div>
                                                    {result.subtitle && (
                                                        <div className="text-xs text-foreground/50 capitalize">
                                                            {result.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 bg-foreground/[0.04] px-2 py-0.5 rounded-full">
                                                    {result.type}
                                                </span>
                                                <ArrowRight className="size-3.5 text-foreground/20 group-hover:text-foreground/50 transition-colors shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/"
                                hash="about"
                                onClick={() => { setMobileOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-foreground bg-foreground/[0.04] dark:bg-foreground/[0.06] border border-foreground/[0.06] dark:border-foreground/[0.12] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>{m["nav.about"]()}</span>
                            </Link>

                            <Link
                                to="/projects"
                                onClick={() => setMobileOpen(false)}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-foreground bg-foreground/[0.04] dark:bg-foreground/[0.06] border border-foreground/[0.06] dark:border-foreground/[0.12] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>{m["nav.projects"]()}</span>
                            </Link>

                            <Link
                                to="/blog"
                                onClick={() => setMobileOpen(false)}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-foreground bg-foreground/[0.04] dark:bg-foreground/[0.06] border border-foreground/[0.06] dark:border-foreground/[0.12] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>{m["nav.blog"]()}</span>
                            </Link>

                            <Link
                                to="/"
                                hash="services"
                                onClick={() => { setMobileOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-foreground bg-foreground/[0.04] dark:bg-foreground/[0.06] border border-foreground/[0.06] dark:border-foreground/[0.12] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>{m["nav.services"]()}</span>
                            </Link>

                            <Link
                                to="/"
                                hash="contact"
                                onClick={() => { setMobileOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="mt-2 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-primary-foreground bg-primary shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                            >
                                <span>{m["nav.contact"]()}</span>
                            </Link>

                            {/* Language & Theme switchers */}
                            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-foreground/[0.08]">
                                <LanguageSwitcher />
                                <ThemeToggle />
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}