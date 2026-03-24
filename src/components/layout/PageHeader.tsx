import React from "react"
import { HeroSlider } from "./HeroSlider"

interface PageHeaderProps {
    label: string;
    title: React.ReactNode;
    subtitle: string;
}

/**
 * Reusable Page Header with a hero-like image slider background.
 * Uses 40vh height by default as a "mini-hero" for subpages.
 */
export function PageHeader({ label, title, subtitle }: PageHeaderProps) {
    return (
        <HeroSlider className="h-[45vh] min-h-[380px] rounded-3xl mb-12">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                {/* label */}
                <p className="rise-in text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-white/50 mb-4 [animation-delay:200ms]">
                    {label}
                </p>
                
                {/* title */}
                <h1 className="rise-in font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight m-0 mb-6 max-w-[20ch] [animation-delay:400ms]">
                    {title}
                </h1>
                
                {/* subtitle */}
                <p className="rise-in text-white/65 text-[clamp(0.9375rem,1.2vw,1.0625rem)] font-light leading-relaxed max-w-[55ch] mx-auto [animation-delay:600ms]">
                    {subtitle}
                </p>
            </div>
        </HeroSlider>
    )
}
