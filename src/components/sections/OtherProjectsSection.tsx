import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '#/components/ui/carousel'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { ProjectCard } from '#/components/projects/ProjectCard'
import { useProjectImageUrls } from '#/hooks/useProjectImages'
import type { Doc } from '../../../convex/_generated/dataModel'

type ProjectDoc = Doc<"projects">

interface OtherProjectsSectionProps {
    currentProjectSlug: string
}

export function OtherProjectsSection({ currentProjectSlug }: OtherProjectsSectionProps) {
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(true)

    const allProjects = useQuery(api.projects.list) ?? []

    // Filter out current project
    const otherProjects = allProjects.filter((p: ProjectDoc) => p.slug !== currentProjectSlug)

    // For mobile we only show 3
    const mobileProjects = otherProjects.slice(0, 3)

    React.useEffect(() => {
        if (!carouselApi) return

        setCanScrollPrev(carouselApi.canScrollPrev())
        setCanScrollNext(carouselApi.canScrollNext())

        carouselApi.on('select', () => {
            setCanScrollPrev(carouselApi.canScrollPrev())
            setCanScrollNext(carouselApi.canScrollNext())
        })
    }, [carouselApi])

    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-1 mb-10 gap-2 md:gap-5">
                <div>
                    <h2 className="text-3xl font-display font-semibold text-foreground">
                        Други <span className="font-light italic text-foreground/50">проекти</span>
                    </h2>
                </div>
                <Link to="/projects">
                    <Button
                        variant="default"
                        className=" rounded-2xl  px-6  transition-all duration-300 font-bold uppercase"
                    >
                        Виж всички проекти
                    </Button>
                </Link>
            </div>

            {/* Mobile Version: Stacking cards (showing 3 as requested) */}
            <div className="flex flex-col gap-2 md:gap-5 sm:hidden">
                {mobileProjects.map((project: ProjectDoc) => (
                    <ProjectCardWithImage key={project._id} project={project} />
                ))}
            </div>

            {/* Desktop Carousel Section */}
            <div className="hidden sm:block">
                <Carousel
                    setApi={setCarouselApi}
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
                        {otherProjects.map((project: ProjectDoc) => (
                            <CarouselItem key={project._id} className="pl-5 basis-1/2 lg:basis-[30.5%]">
                                <ProjectCardWithImage project={project} />
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
                        onClick={() => carouselApi?.scrollPrev()}
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
                        onClick={() => carouselApi?.scrollNext()}
                        disabled={!canScrollNext}
                    >
                        <ChevronRight className="h-5 w-5 text-black/70" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

/** Wrapper component that resolves the first image URL for a project card */
function ProjectCardWithImage({ project }: { project: ProjectDoc }) {
    const resolvedUrls = useProjectImageUrls(project.images)
    const firstImageUrl = project.images.length > 0 ? resolvedUrls[0] : null
    return <ProjectCard project={project} imageUrl={firstImageUrl} />
}