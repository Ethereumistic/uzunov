import { Link } from "@tanstack/react-router"
import { Logo } from "./Logo"
import { Wifi, ArrowUpRight, MapPin, Mail, Phone, Building2, Palette, Cog, Handshake, Box, ClipboardCheck } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const services = [
        { label: "Архитектура", href: "/services/architecture", icon: Building2 },
        { label: "Интериорен дизайн", href: "/services/interior", icon: Palette },
        { label: "Инженерно проектиране", href: "/services/engineering", icon: Cog },
        { label: "Консултиране", href: "/services/consulting", icon: Handshake },
        { label: "3D Анимация и VR", href: "/services/3d", icon: Box },
        { label: "Управление на проекти", href: "/services/projects", icon: ClipboardCheck },
    ]

    const quickLinks = [
        { label: "За нас", href: "/#about" },
        { label: "Проекти", href: "/projects" },
        { label: "Контакти", href: "/#contact" },
    ]

    return (
        <footer className="relative mt-32 border-t border-black/3 bg-linear-to-b from-transparent to-white/40 py-8 overflow-hidden">

            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 gap-12 lg:grid-cols-12 lg:gap-8">
                    {/* Col 1: Brand & Motto */}
                    <div className="col-span-2 lg:col-span-4 flex flex-col items-start gap-8 order-1">
                        <Link to="/" className="transition-opacity hover:opacity-80">
                            <Logo type="horizontal" size="lg" variant="black" />
                        </Link>
                        <p className="max-w-sm text-base leading-relaxed text-foreground/80 font-medium italic">
                            &ldquo;Архитектурата е изкуство, което балансира иновации и практичност.&rdquo;
                        </p>
                    </div>

                    {/* Col: Studio */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col gap-8 order-2">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 select-none font-display">
                            Студио
                        </h3>
                        <nav className="flex flex-col gap-4">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href as any}
                                    className="group text-[12px] font-semibold text-foreground/70 hover:text-primary transition-all flex items-center gap-1 w-fit"
                                >
                                    <span className="relative">
                                        {link.label}
                                        <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                                    </span>
                                    <ArrowUpRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Col: Contacts */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col gap-8 lg:pl-4 order-3 lg:order-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 select-none font-display">
                            Контакти
                        </h3>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:arh_uzunov@abv.bg" className="flex items-center gap-3 text-[12px] font-semibold text-foreground/70 hover:text-primary transition-colors group w-fit whitespace-nowrap">
                                <div className="flex items-center justify-center size-7 rounded-lg bg-black/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                    <Mail className="size-3.5" />
                                </div>
                                <span>arh_uzunov@abv.bg</span>
                            </a>
                            <a href="tel:+359887261838" className="flex items-center gap-3 text-[12px] font-semibold text-foreground/70 hover:text-primary transition-colors group w-fit whitespace-nowrap">
                                <div className="flex items-center justify-center size-7 rounded-lg bg-black/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                    <Phone className="size-3.5" />
                                </div>
                                +359 887 261 838
                            </a>
                            <div className="flex items-center gap-3 text-[12px] font-semibold text-foreground/70 group">
                                <div className="flex items-center justify-center size-7 rounded-lg bg-black/5 shrink-0">
                                    <MapPin className="size-3.5" />
                                </div>
                                Габрово, България
                            </div>
                        </div>
                    </div>

                    {/* Col: Services */}
                    <div className="col-span-2 lg:col-span-4 flex flex-col gap-8 order-4 lg:order-3">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/50 select-none font-display">
                            Услуги
                        </h3>
                        <nav className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {services.map((service) => (
                                <Link
                                    key={service.label}
                                    to={service.href as any}
                                    className="group text-[12px] font-semibold text-foreground/70 hover:text-primary transition-all flex items-center gap-2.5 w-fit"
                                >
                                    <div className="flex items-center justify-center size-7 rounded-lg bg-black/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                        <service.icon className="size-3.5" />
                                    </div>
                                    <span className="relative text-left leading-snug">
                                        {service.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-[12px] font-medium text-foreground/40">
                            &copy; {currentYear} Узунов Проект. Всички права запазени.
                        </p>

                    </div>

                    <nav className="flex items-center gap-6">
                        <Link to="/privacy" className="text-[11px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors">
                            Поверителност
                        </Link>
                        <Link to="/terms" className="text-[11px] font-bold uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors">
                            Условия
                        </Link>
                    </nav>

                    <a
                        href="https://echoray.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 text-xs text-foreground/50 transition-all duration-300"
                    >
                        Разработен и поддържан от <span className="font-bold flex items-center gap-1 tracking-tight text-foreground/80 transition-all">
                            <span className="opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 bg-blue-600 rounded-lg p-0.5 transition-all duration-500 shadow-xl shadow-blue-500/20">
                                <Wifi className="size-5 text-white" />
                            </span>
                            <span className="-ml-7 group-hover:ml-0 transition-all duration-300">Echoray.io</span>
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    )
}
