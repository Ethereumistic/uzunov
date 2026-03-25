import React from "react"
import { HeroSlider, type SlideData } from "./HeroSlider"

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: string;
    slides?: SlideData[];
}

/**
 * Reusable Page Header with a hero-like image slider background.
 * Uses 45vh height by default as a "mini-hero" for subpages.
 */
export function PageHeader({ title, subtitle, slides }: PageHeaderProps) {
    return (
        <HeroSlider slides={slides} className="h-[45vh] min-h-[380px] rounded-3xl mb-12">
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-14 p-6 text-center text-white">
                {/* title */}
                <h1 className="rise-in z-50 font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight m-0 mb-6 max-w-[20ch] [animation-delay:400ms]">
                    {title}
                </h1>

                {/* subtitle */}
                {subtitle && (
                    <p className="rise-in  text-white text-[clamp(0.9375rem,1.2vw,1.0625rem)] font-light leading-relaxed max-w-[55ch] mx-auto [animation-delay:600ms]">
                        {subtitle}
                    </p>
                )}
            </div>
        </HeroSlider>
    )
}
