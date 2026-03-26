import React from 'react'
import { PageHeader } from '#/components/layout/PageHeader'
import type { SlideData } from '#/components/layout/HeroSlider'
import { useLocation } from '@tanstack/react-router'
import { OtherServicesSection } from '#/components/sections/OtherServicesSection'

interface ServiceLayoutProps {
    title: React.ReactNode;
    subtitle: string;
    heroImage: SlideData;
    bentoImages: string[];
    ctaImage: string;
    children: React.ReactNode;
}

export function ServiceLayout({ title, subtitle, heroImage, bentoImages, ctaImage, children }: ServiceLayoutProps) {
    const { pathname } = useLocation()
    return (
        <div className="min-h-screen p-2 md:p-5 bg-transparent">
            {/* The single hero slide */}
            <PageHeader
                title={title}
                subtitle={subtitle}
                slides={[heroImage]}
            />

            <div className="max-w-7xl mx-auto pt-12 md:pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-20 lg:gap-y-12 items-stretch">

                    {/* 1. Text Content (Left Top on Desktop, 1st on Mobile) */}
                    <div className="order-1 lg:col-start-1 lg:row-start-1 px-5">
                        {children}
                    </div>

                    {/* 2. Bento Grid (Right spanning full height on Desktop, 2nd on Mobile) */}
                    <div className="relative order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 grid grid-cols-2 grid-rows-4 gap-2 md:gap-5 h-full min-h-[600px] lg:min-h-[700px] w-full">
                        {bentoImages[0] && (
                            <div className="col-span-2 row-span-2 relative min-h-0 rounded-3xl overflow-hidden bg-stone-100 shadow-lg border border-black/5 group">
                                <img src={bentoImages[0]} alt="Service details top" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                            </div>
                        )}
                        {bentoImages[1] && (
                            <div className="col-span-1 row-span-2 relative min-h-0 rounded-3xl overflow-hidden bg-stone-100 shadow-lg border border-black/5 group">
                                <img src={bentoImages[1]} alt="Service details left" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                            </div>
                        )}
                        {bentoImages[2] && (
                            <div className="col-span-1 row-span-1 relative min-h-0 rounded-3xl overflow-hidden bg-stone-100 shadow-lg border border-black/5 group">
                                <img src={bentoImages[2]} alt="Service details right 1" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                            </div>
                        )}
                        {bentoImages[3] && (
                            <div className="col-span-1 row-span-1 relative min-h-0 rounded-3xl overflow-hidden bg-stone-100 shadow-lg border border-black/5 group">
                                <img src={bentoImages[3]} alt="Service details right 2" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                            </div>
                        )}
                    </div>

                    {/* 3. CTA Card (Left Bottom on Desktop, 3rd on Mobile) */}
                    <div className="order-3 lg:col-start-1 lg:row-start-2 self-end w-full lg:mt-auto -mt-10">
                        <div className="relative h-auto min-h-[320px] w-full flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/40 bg-stone-100 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(31,38,135,0.15)] hover:border-white/60 group">
                            <img
                                src={ctaImage}
                                alt="Contact CTA"
                                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20 z-0" />
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0" />

                            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center w-full">
                                <div className="relative bg-white/10 backdrop-blur-md rounded-full w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-4 border border-white/20 shadow-lg">
                                    <svg className="w-8 h-8 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 sm:p-5 lg:p-6 border border-white/20 shadow-xl max-w-sm">
                                    <h3 className="font-display text-2xl font-semibold mb-2 sm:text-xl lg:text-2xl text-white leading-tight">Имате идея?</h3>
                                    <p className="text-white/90 mb-4 sm:mb-3 lg:mb-4 text-sm">Свържете се с нас за консултация по вашия следващ проект</p>
                                    <a href="/#contact" className="inline-block px-6 py-3 bg-white/90 backdrop-blur-md text-[#1a1916] rounded-xl font-medium hover:bg-white transition-all duration-200 sm:px-5 sm:py-2 lg:px-6 lg:py-3 shadow-lg">
                                        Свържете се с нас
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Other Services Section */}
                <div className="mt-24">
                    <OtherServicesSection currentServiceHref={pathname} />
                </div>
            </div>
        </div>
    )
}
