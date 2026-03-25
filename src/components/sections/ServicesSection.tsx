import { Card } from '#/components/ui/card'
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
        <section id="services" className="relative w-full overflow-hidden py-12 px-5 scroll-mt-12">
            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
                        <span className="font-light italic text-black/40">Нашите</span> Услуги
                    </h2>

                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <Link key={index} to={service.href} className="block group">
                            <Card
                                className="relative overflow-hidden rounded-3xl border-0 bg-transparent h-[440px] flex flex-col justify-end"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <div
                                        className="h-full w-full bg-cover bg-center transition-transform duration-2000 ease-out group-hover:scale-105"
                                        style={{ backgroundImage: `url(${service.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/95 transition-opacity duration-700" />
                                </div>

                                {/* Content block */}
                                <div className="relative z-10 p-6 sm:p-8 flex flex-col w-full h-full justify-end overflow-hidden">
                                    <div className="flex items-center gap-4 mb-4 transition-transform duration-800 ease-out md:-mb-5 md:group-hover:-translate-y-15">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14">
                                            <service.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md md:text-2xl">{service.title}</h3>
                                    </div>
                                    <p className="text-base leading-relaxed text-white/90 font-light drop-shadow-md transition-all duration-500 delay-200 ease-out md:opacity-0 md:group-hover:opacity-100 md:absolute md:bottom-2 md:left-8 md:right-8">
                                        {service.description}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
