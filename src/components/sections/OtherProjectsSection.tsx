import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { projects } from '#/data/projects'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '#/components/ui/carousel'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { ProjectCard } from '#/components/projects/ProjectCard'

interface OtherProjectsSectionProps {
    currentProjectId: string
}

export function OtherProjectsSection({ currentProjectId }: OtherProjectsSectionProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(true)

    // Filter out current project and shuffle or just take next ones? 
    // Usually "next" ones or just filter out current.
    const otherProjects = projects.filter(p => p.id !== currentProjectId)

    // For mobile we only show 3
    const mobileProjects = otherProjects.slice(0, 3)

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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-1 mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-display font-semibold text-[#1a1916]">
                        Други <span className="font-light italic text-black/40">проекти</span>
                    </h2>
                </div>
                <Link to="/projects">
                    <Button
                        variant="outline"
                        className="rounded-full border-stone-200 px-6 hover:bg-[#1a1916] transition-all duration-300 font-bold uppercase"
                    >
                        Виж всички проекти
                    </Button>
                </Link>
            </div>

            {/* Mobile Version: Stacking cards (showing 3 as requested) */}
            <div className="flex flex-col gap-6 sm:hidden">
                {mobileProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* Desktop Carousel Section */}
            <div className="hidden sm:block">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: 'start',
                        loop: false,
                        watchDrag: true,
                        dragFree: true,
                        slidesToScroll: 2,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-6">
                        {otherProjects.map((project) => (
                            <CarouselItem key={project.id} className="pl-6 basis-1/2 lg:basis-[30.5%]">
                                <ProjectCard project={project} />
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
                        <ChevronLeft className="h-5 w-5 text-black/70" />
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
                        <ChevronRight className="h-5 w-5 text-black/70" />
                    </Button>
                </div>
            </div>
        </section>
    )
}
