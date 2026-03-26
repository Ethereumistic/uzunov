import * as React from "react"
import { Logo } from "./Logo"
import { cn } from "../../lib/utils"
import {
    Building2,
    PenTool,
    Cog,
    MessageSquare,
    Box,
    ClipboardCheck,
    Menu,
    X,
    ChevronDown
} from 'lucide-react'
import { Link } from "@tanstack/react-router"

const services = [
    {
        title: "Архитектура",
        description: "Цялостни архитектурни решения от концепция до реализация.",
        icon: <Building2 className="size-6 text-black" />,
        href: "/services/architecture"
    },
    {
        title: "Интериорен дизайн",
        description: "Индивидуални проекти за пространства, съчетаващи стил и комфорт.",
        icon: <PenTool className="size-6 text-black" />,
        href: "/services/interior"
    },
    {
        title: "Инженерно проектиране",
        description: "Прецизни инженерни планове и техническа документация.",
        icon: <Cog className="size-6 text-black" />,
        href: "/services/engineering"
    },
    {
        title: "Консултиране",
        description: "Професионални съвети и експертно мнение за вашия проект.",
        icon: <MessageSquare className="size-6 text-black" />,
        href: "/services/consulting"
    },
    {
        title: "3D Анимация и VR",
        description: "Фотореалистични визуализации и потапящи VR преживявания.",
        icon: <Box className="size-6 text-black" />,
        href: "/services/3d"
    },
    {
        title: "Управление на проекти",
        description: "Координация и контрол на целия инвестиционен процес.",
        icon: <ClipboardCheck className="size-6 text-black" />,
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
        <header className="sticky top-5 -translate-y-3 md:translate-y-0 md:top-4 mt-8 mb-[-96px] left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ease-in-out">
            <div ref={navRef} className="w-full max-w-[22rem] sm:max-w-xl md:max-w-3xl xl:max-w-5xl 2xl:max-w-280 pointer-events-auto transition-all duration-300 relative h-[64px]">
                {/*
                  ROUNDING FIX: Always rounded-3xl — never toggle the border-radius.
                  Animating between rounded-full and a lower radius causes ugly shape
                  distortion during the transition. rounded-3xl (24px) reads as a pill
                  at 64px tall and smoothly becomes a rounded-rect when expanded.
                */}
                <div className="absolute top-0 left-0 right-0 px-6 rounded-3xl transition-all duration-300 ease-in-out border border-white/20 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-[15px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] saturate-150">

                    {/* Main bar */}
                    <div className="flex items-center justify-between h-[64px]">

                        {/* Logo */}
                        <div className="flex shrink-0 items-center -translate-x-2.5">
                            <Link to="/" className="transition-opacity">
                                <Logo type="horizontal" size="lg" variant="black" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav
                            className="hidden md:flex items-center gap-1"
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
                                        ? "text-black"
                                        : hoveredNav === null
                                            ? "text-black/70"
                                            : "text-black/40"
                                )}
                            >
                                За нас
                            </Link>

                            <Link
                                to="/projects"
                                onMouseEnter={() => setHoveredNav("projects")}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold uppercase transition-all duration-150 select-none",
                                    hoveredNav === "projects"
                                        ? "text-black"
                                        : hoveredNav === null
                                            ? "text-black/70"
                                            : "text-black/40"
                                )}
                            >
                                Проекти
                            </Link>

                            {/* Services trigger — hover activates panel */}
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
                                            ? "text-black ring-1 ring-black/12 bg-black/4"
                                            : hoveredNav === "services"
                                                ? "text-black"
                                                : hoveredNav === null
                                                    ? "text-black/70"
                                                    : "text-black/40"
                                    )}
                                >
                                    Услуги
                                    <ChevronDown
                                        className={cn(
                                            "size-3.5 transition-transform duration-300",
                                            servicesOpen && "rotate-180"
                                        )}
                                    />
                                </Link>
                            </div>
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center  -mr-3">
                            <Link
                                to="/"
                                hash="contact"
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="hidden md:inline-flex bg-black text-white px-6 py-2.5 rounded-2xl text-sm font-bold uppercase hover:bg-black/80 transition-all shadow-lg hover:shadow-black/20"
                            >
                                Контакт
                            </Link>
                            <button
                                className="md:hidden text-black rounded-full hover:bg-black/5 transition-colors p-2"
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
                            <Link
                                key={service.href}
                                to={service.href as any}
                                onClick={() => setServicesOpen(false)}
                                className="group flex items-center gap-4 rounded-2xl border border-black/8 p-4 transition-all duration-200 hover:bg-black/4 hover:border-black/20"
                            >
                                <div className="flex items-center justify-center size-11 rounded-xl bg-black/6 shrink-0 transition-transform group-hover:scale-105">
                                    {service.icon}
                                </div>
                                <span className="font-semibold text-[15px] text-black leading-tight">
                                    {service.title}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Expanded Menu */}
                    <div
                        className={cn(
                            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
                            mobileOpen
                                ? "max-h-[600px] opacity-100 pb-5 pt-3"
                                : "max-h-0 opacity-0 pb-0 pt-0 pointer-events-none"
                        )}
                    >
                        <nav className="flex flex-col gap-2.5 group/nav">
                            <Link
                                to="/"
                                hash="about"
                                onClick={() => { setMobileOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-black bg-white/40 border border-white/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>За нас</span>
                            </Link>

                            <Link
                                to="/projects"
                                onClick={() => setMobileOpen(false)}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-black bg-white/40 border border-white/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>Проекти</span>
                            </Link>

                            <Link
                                to="/"
                                hash="services"
                                onClick={() => { setMobileOpen(false); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="px-5 py-3.5 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-black bg-white/40 border border-white/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform flex items-center justify-center"
                            >
                                <span>Услуги</span>
                            </Link>

                            <Link
                                to="/"
                                hash="contact"
                                onClick={() => { setMobileOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                                className="mt-2 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-white bg-black shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                            >
                                <span>Контакт</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}