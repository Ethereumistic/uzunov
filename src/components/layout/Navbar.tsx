import * as React from "react"
import { Logo } from "./Logo"
import { cn } from "../../lib/utils"
import { Building2, Palette, Cog, Handshake, Box, ClipboardCheck, Menu, X, ChevronDown } from "lucide-react"

const services = [
    {
        title: "Архитектура",
        description: "Цялостни архитектурни решения от концепция до реализация.",
        icon: <Building2 className="size-5 text-black" />,
        href: "/services/architecture"
    },
    {
        title: "Интериорен дизайн",
        description: "Индивидуални проекти за пространства, съчетаващи стил и комфорт.",
        icon: <Palette className="size-5 text-black" />,
        href: "/services/interior"
    },
    {
        title: "Инженерно проектиране",
        description: "Прецизни инженерни планове и техническа документация.",
        icon: <Cog className="size-5 text-black" />,
        href: "/services/engineering"
    },
    {
        title: "Консултиране",
        description: "Професионални съвети и експертно мнение за вашия проект.",
        icon: <Handshake className="size-5 text-black" />,
        href: "/services/consulting"
    },
    {
        title: "3D Анимация и VR",
        description: "Фотореалистични визуализации и потапящи VR преживявания.",
        icon: <Box className="size-5 text-black" />,
        href: "/services/3d"
    },
    {
        title: "Управление на проекти",
        description: "Координация и контрол на целия инвестиционен процес.",
        icon: <ClipboardCheck className="size-5 text-black" />,
        href: "/services/projects"
    },
]

export function Navbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const [servicesOpen, setServicesOpen] = React.useState(false)
    const [hoveredNav, setHoveredNav] = React.useState<string | null>(null)
    const navRef = React.useRef<HTMLDivElement>(null)
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    // Close on outside click
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
        <header className="sticky top-4 mt-8 mb-[-96px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ease-in-out">
            <div ref={navRef} className="w-full max-w-[27rem] sm:max-w-xl md:max-w-3xl xl:max-w-5xl 2xl:max-w-280 pointer-events-auto transition-all duration-300 relative h-[64px]">
                {/*
                  ROUNDING FIX: Always rounded-3xl — never toggle the border-radius.
                  Animating between rounded-full and a lower radius causes ugly shape
                  distortion during the transition. rounded-3xl (24px) reads as a pill
                  at 64px tall and smoothly becomes a rounded-rect when expanded.
                */}
                <div className="absolute top-0 left-0 right-0 px-6 rounded-4xl transition-all duration-300 ease-in-out border border-white/20 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-[15px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] saturate-150">

                    {/* Main bar */}
                    <div className="flex items-center justify-between h-[64px]">

                        {/* Logo */}
                        <div className="flex shrink-0 items-center">
                            <a href="/" className="transition-opacity">
                                <Logo type="horizontal" size="lg" variant="black" />
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav
                            className="hidden md:flex items-center gap-1"
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <a
                                href="#about"
                                onMouseEnter={() => setHoveredNav("about")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 select-none",
                                    hoveredNav === null || hoveredNav === "about"
                                        ? "text-black"
                                        : "text-black/30"
                                )}
                            >
                                За нас
                            </a>

                            <a
                                href="/projects"
                                onMouseEnter={() => setHoveredNav("projects")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 select-none",
                                    hoveredNav === null || hoveredNav === "projects"
                                        ? "text-black"
                                        : "text-black/30"
                                )}
                            >
                                Проекти
                            </a>

                            {/* Services trigger — hover activates panel */}
                            <div
                                onMouseEnter={() => { handleServicesMouseEnter(); setHoveredNav("services") }}
                                onMouseLeave={() => { handleServicesMouseLeave(); setHoveredNav(null) }}
                            >
                                <button
                                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                    className={cn(
                                        "inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 select-none",
                                        servicesOpen
                                            ? "text-black ring-1 ring-black/12 bg-black/4"
                                            : hoveredNav === null || hoveredNav === "services"
                                                ? "text-black"
                                                : "text-black/30"
                                    )}
                                >
                                    Услуги
                                    <ChevronDown
                                        className={cn(
                                            "size-3.5 transition-transform duration-300",
                                            servicesOpen && "rotate-180"
                                        )}
                                    />
                                </button>
                            </div>
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <a
                                href="#contact"
                                className="hidden md:inline-flex bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black/80 transition-all shadow-lg hover:shadow-black/20"
                            >
                                Контакти
                            </a>
                            <button
                                className="md:hidden p-2 text-black rounded-full hover:bg-black/5 transition-colors"
                                onClick={() => {
                                    setMobileOpen(prev => !prev)
                                    setServicesOpen(false)
                                }}
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
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
                        {services.map((service) => (
                            <a
                                key={service.href}
                                href={service.href}
                                onClick={() => setServicesOpen(false)}
                                className="group flex flex-col gap-3 rounded-2xl border border-black/10 p-4 transition-all duration-200 hover:bg-black/4 hover:border-black/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-9 rounded-xl bg-black/6 shrink-0">
                                        {service.icon}
                                    </div>
                                    <span className="font-semibold text-sm text-black leading-tight">
                                        {service.title}
                                    </span>
                                </div>
                                <p className="text-xs text-black/50 leading-relaxed">
                                    {service.description}
                                </p>
                            </a>
                        ))}
                    </div>

                    {/* Mobile Expanded Menu */}
                    <div
                        className={cn(
                            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
                            mobileOpen
                                ? "max-h-[800px] opacity-100 pb-5 pt-1"
                                : "max-h-0 opacity-0 pb-0 pt-0 pointer-events-none"
                        )}
                    >
                        <nav className="flex flex-col gap-1 mb-4 border-b border-black/8 pb-4">
                            <a
                                href="#about"
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2.5 rounded-xl text-sm font-medium text-black hover:bg-black/5 transition-colors"
                            >
                                За нас
                            </a>
                            <a
                                href="/projects"
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2.5 rounded-xl text-sm font-medium text-black hover:bg-black/5 transition-colors"
                            >
                                Проекти
                            </a>
                        </nav>

                        <p className="text-[11px] font-semibold tracking-widest text-black/35 uppercase mb-3 px-1">
                            Услуги
                        </p>
                        <div className="flex flex-col gap-2">
                            {services.map((service) => (
                                <a
                                    key={service.href}
                                    href={service.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-2xl border border-black/10 p-3.5 transition-all duration-200 hover:bg-black/4"
                                >
                                    <div className="flex items-center justify-center size-9 rounded-xl bg-black/6 shrink-0">
                                        {service.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-black leading-tight">{service.title}</p>
                                        <p className="text-xs text-black/50 mt-0.5 leading-snug">{service.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <a
                            href="#contact"
                            onClick={() => setMobileOpen(false)}
                            className="mt-4 flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-black/80 transition-all"
                        >
                            Контакти
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}