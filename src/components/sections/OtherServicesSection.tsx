import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { services } from '#/components/sections/ServicesSection'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '#/components/ui/carousel'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface OtherServicesSectionProps {
    currentServiceHref: string
}

export function OtherServicesSection({ currentServiceHref }: OtherServicesSectionProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(true)

    const otherServices = services.filter(s => s.href !== currentServiceHref)

    React.useEffect(() => {
        if (!api) return

        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())

        api.on('select', () => {
            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        })
    }, [api])

    return (
        <section className="w-full">
            <div className="px-1 mb-10">
                <h2 className="text-3xl font-display font-semibold text-[#1a1916]">
                    Други <span className="font-light italic text-black/40">услуги</span>
                </h2>
            </div>

            {/* Mobile Version: Stacking cards */}
            <div className="flex flex-col gap-3 sm:hidden">
                {otherServices.map((service, index) => (
                    <Link key={index} to={service.href} className="group block">
                        <div className="relative aspect-video overflow-hidden rounded-3xl bg-stone-100 shadow-lg  ">
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

            {/* Desktop Carousel Section */}
            <div className="hidden sm:block">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: 'start',
                        loop: false,
                        watchDrag: true, // Now swipable/draggable
                        dragFree: true,
                        slidesToScroll: 3,  // Momentum scroll for Apple feel
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 sm:-ml-6">
                        {otherServices.map((service, index) => (
                            <CarouselItem key={index} className="pl-4 sm:pl-6 basis-[85%] sm:basis-1/2 lg:basis-[29.5%]">
                                <Link to={service.href} className="group block">
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Navigation Arrows at bottom right - only for Desktop */}
                <div className="flex items-center justify-end gap-3 mt-10 px-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                            "rounded-full border-black/10 size-12 bg-white hover:bg-black/5 transition-all duration-300 shadow-sm",
                            !canScrollPrev && "opacity-30 cursor-not-allowed"
                        )}
                        onClick={() => api?.scrollPrev()}
                        disabled={!canScrollPrev}
                    >
                        <ArrowLeft className="h-5 w-5 text-black/70" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                            "rounded-full border-black/10 size-12 bg-white hover:bg-black/5 transition-all duration-300 shadow-sm",
                            !canScrollNext && "opacity-30 cursor-not-allowed"
                        )}
                        onClick={() => api?.scrollNext()}
                        disabled={!canScrollNext}
                    >
                        <ArrowRight className="h-5 w-5 text-black/70" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
