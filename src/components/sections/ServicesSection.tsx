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
const services = [
    {
        title: 'Архитектура',
        description: 'Цялостни архитектурни решения от концепция до реализация.',
        icon: Building2,
        image: `${baseUrl}/architecture/6_S.webp`,
        href: '/services/architecture'
    },
    {
        title: 'Интериорен дизайн',
        description: 'Индивидуални проекти за пространства, съчетаващи стил и комфорт.',
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
        <section id="services" className="relative w-full overflow-hidden py-12 px-5">
            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
                        <span className="font-light italic text-black/40">Нашите</span> Услуги
                    </h2>

                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <Link key={index} to={service.href} className="block group">
                            <Card
                                className="relative overflow-hidden rounded-2xl border-0 bg-transparent h-[380px] flex flex-col justify-end"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <div
                                        className="h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                        style={{ backgroundImage: `url(${service.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/50 to-black/80 transition-opacity duration-700" />
                                </div>

                                {/* Content block */}
                                <div className="relative z-10 p-5 sm:p-6 flex flex-col w-full transition-transform duration-500 group-hover:-translate-y-2">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110">
                                        <service.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="mb-1.5 text-xl font-bold text-white tracking-tight drop-shadow-md">{service.title}</h3>
                                    <p className="text-[0.9375rem] leading-relaxed text-white/90 font-light drop-shadow-md">{service.description}</p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
