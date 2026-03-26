import { Link } from '@tanstack/react-router'
import {
    Building2,
    PenTool,
    Cog,
    MessageSquare,
    Box,
    ClipboardCheck,
} from 'lucide-react'

// Services data using our CDN S variants
const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services'
export const services = [
    {
        title: 'Архитектура',
        description: 'Цялостни архитектурни решения от концепция до реализация.',
        icon: Building2,
        image: `${baseUrl}/architecture/6_S.webp`,
        href: '/services/architecture'
    },
    {
        title: 'Интериорен дизайн',
        description: 'Проектиране на пространства, съчетаващи стил и комфорт.',
        icon: PenTool,
        image: `${baseUrl}/interior/1_S.webp`,
        href: '/services/interior'
    },
    {
        title: 'Инженерно проектиране',
        description: 'Прецизни инженерни планове и техническа документация.',
        icon: Cog,
        image: `${baseUrl}/engineering/2_S.webp`,
        href: '/services/engineering'
    },
    {
        title: 'Консултиране',
        description: 'Професионални съвети и експертно мнение за вашия проект.',
        icon: MessageSquare,
        image: `${baseUrl}/consulting/5_S.webp`,
        href: '/services/consulting'
    },
    {
        title: '3D Анимация и VR',
        description: 'Фотореалистични визуализации и потапящи VR преживявания.',
        icon: Box,
        image: `${baseUrl}/3D/6_S.webp`,
        href: '/services/3d'
    },
    {
        title: 'Управление на проекти',
        description: 'Координация и контрол на целия инвестиционен процес.',
        icon: ClipboardCheck,
        image: `${baseUrl}/projects/5_S.webp`,
        href: '/services/projects'
    }
]

export function ServicesSection() {
    return (
        <section id="services" className="relative w-full overflow-hidden py-16 px-0 md:px-5 scroll-mt-20">
            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
                        <span className="font-light italic text-black/40">Нашите</span> Услуги
                    </h2>
                </div>

                {/* Mobile Version: Stacking cards */}
                <div className="flex flex-col gap-2 md:gap-5 sm:hidden">
                    {services.map((service, index) => (
                        <Link key={index} to={service.href} className="group block">
                            <div className="relative aspect-video overflow-hidden rounded-3xl bg-stone-100 shadow-lg">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                {/* Always visible gradient */}
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black/95" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg">
                                            <service.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/90 line-clamp-2 font-light leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Desktop/Tablet Grid Section */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3  gap-2 md:gap-5">
                    {services.map((service, index) => (
                        <Link key={index} to={service.href} className="group block">
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-stone-100 shadow-lg border border-black/5">
                                {/* Image background */}
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                />

                                {/* Always visible gradient */}
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/90 transition-opacity duration-700" />

                                {/* Content (Bottom aligned) */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                    <div className="flex items-center gap-5 mb-5 transition-transform duration-500 group-hover:translate-x-1">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110">
                                            <service.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight drop-shadow-md leading-tight">{service.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/95 line-clamp-3 leading-relaxed font-light transition-all duration-500 group-hover:text-white">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
