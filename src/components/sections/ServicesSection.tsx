import { Link } from '@tanstack/react-router'
import {
    Building2,
    Map,
    Cog,
    MessageSquare,
    Box,
    ClipboardCheck,
} from 'lucide-react'
import { m } from '#/paraglide/messages'

// Services data using our CDN S variants
const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services'
export const services = [
    {
        titleKey: 'services.architecture.title',
        descriptionKey: 'services.architecture.description',
        icon: Building2,
        image: `${baseUrl}/architecture/6_S.webp`,
        href: '/services/architecture'
    },
    {
        titleKey: 'services.urban.title',
        descriptionKey: 'services.urban.description',
        icon: Map,
        image: `${baseUrl}/interior/1_S.webp`,
        href: '/services/urban'
    },
    {
        titleKey: 'services.engineering.title',
        descriptionKey: 'services.engineering.description',
        icon: Cog,
        image: `${baseUrl}/engineering/2_S.webp`,
        href: '/services/engineering'
    },
    {
        titleKey: 'services.consulting.title',
        descriptionKey: 'services.consulting.description',
        icon: MessageSquare,
        image: `${baseUrl}/consulting/5_S.webp`,
        href: '/services/consulting'
    },
    {
        titleKey: 'services.3d.title',
        descriptionKey: 'services.3d.description',
        icon: Box,
        image: `${baseUrl}/3D/6_S.webp`,
        href: '/services/3d'
    },
    {
        titleKey: 'services.projectManagement.title',
        descriptionKey: 'services.projectManagement.description',
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
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] tracking-tight text-foreground">
                        {(() => {
                            const t = m["services.sectionTitle"]()
                            const [first, ...rest] = t.split(' ')
                            return <>{first}{rest.length > 0 && <span className="font-bold"> {rest.join(' ')}</span>}</>
                        })()}
                    </h2>
                </div>

                {/* Mobile Version: Stacking cards */}
                <div className="flex flex-col gap-2 md:gap-5 sm:hidden">
                    {services.map((service, index) => (
                        <Link key={index} to={service.href} className="group block">
                            <div className="relative aspect-video overflow-hidden rounded-3xl bg-stone-100 shadow-lg">
                                <img
                                    src={service.image}
                                    alt={m[service.titleKey as keyof typeof m]()}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                {/* Always visible gradient */}
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/50 to-black/95" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg">
                                            <service.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight">{m[service.titleKey as keyof typeof m]()}</h3>
                                    </div>
                                    <p className="text-sm text-white/90 line-clamp-2 font-light leading-relaxed">
                                        {m[service.descriptionKey as keyof typeof m]()}
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
                            <div className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-lg  ">
                                {/* Image background */}
                                <img
                                    src={service.image}
                                    alt={m[service.titleKey as keyof typeof m]()}
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
                                        <h3 className="text-2xl font-bold tracking-tight drop-shadow-md leading-tight">{m[service.titleKey as keyof typeof m]()}</h3>
                                    </div>
                                    <p className="text-sm text-white/95 line-clamp-3 leading-relaxed font-light transition-all duration-500 group-hover:text-white">
                                        {m[service.descriptionKey as keyof typeof m]()}
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
