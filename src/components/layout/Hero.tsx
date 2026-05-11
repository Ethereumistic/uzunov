import { useEffect, useState, useRef } from 'react'
import { ArrowRight, MoveRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { HeroSlider, useHeroSlider } from "./HeroSlider"
import { m } from "../../paraglide/messages"

// ── Animated number (same pattern as NumbersSection) ─────────────────────
function AnimatedNumber({ value }: { value: string }) {
    // Awards like "x1" / "x2" are static — no animation needed
    if (/^x\d+$/i.test(value)) {
        return <span className="tabular-nums">{value}</span>
    }

    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
    const suffix = value.replace(/[0-9]/g, '')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) setHasAnimated(true)
            },
            { threshold: 0.1 }
        )
        if (elementRef.current) observer.observe(elementRef.current)
        return () => observer.disconnect()
    }, [hasAnimated])

    useEffect(() => {
        if (!hasAnimated) return
        let startTimestamp: number | null = null
        const duration = 1800
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            const easeOutExpo = (x: number): number => x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
            setDisplayValue(Math.floor(easeOutExpo(progress) * numericValue))
            if (progress < 1) window.requestAnimationFrame(step)
        }
        window.requestAnimationFrame(step)
    }, [hasAnimated, numericValue])

    return (
        <span ref={elementRef} className="tabular-nums">
            {displayValue}{suffix}
        </span>
    )
}

// ── Corner badge ─────────────────────────────────────────────────────────
function CornerBadge({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center leading-tight">
            <span className="font-display text-[clamp(1rem,2.5vw,1.75rem)] font-bold text-white drop-shadow-lg">
                <AnimatedNumber value={value} />
            </span>
            <span className="font-sans text-[clamp(0.45rem,1vw,0.7rem)] font-bold uppercase tracking-[0.25em] text-white/90 drop-shadow-md">
                {label}
            </span>
        </div>
    )
}

// ── 4 corner stats for the hero image ───────────────────────────────────
const heroStats = [
    { value: '30+', labelKey: 'hero.stats.years.label', position: 'top-left' },
    { value: '300+', labelKey: 'hero.stats.projects.label', position: 'top-right' },
    { value: 'x1', labelKey: 'hero.stats.facade.label', position: 'bottom-left' },
    { value: 'x2', labelKey: 'hero.stats.building.label', position: 'bottom-right' },
]

function HeroContent() {
    const { current, go, slides } = useHeroSlider()

    return (
        <>
            {/* ── 4 corner badges (over the image) ────────────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                {heroStats.map((stat) => {
                    const isTop = stat.position.startsWith('top')
                    const isLeft = stat.position.endsWith('left')
                    return (
                        <div
                            key={stat.position}
                            className={`absolute ${isTop ? 'top-25 xl:top-6' : 'bottom-6'} ${isLeft ? 'left-6' : 'right-6'} z-10 opacity-0 animate-[fade-in_600ms_ease_forwards]`}
                        >
                            <CornerBadge value={stat.value} label={m[stat.labelKey as keyof typeof m]()} />
                        </div>
                    )
                })}
            </div>

            {/* ── Centre content ──────────────────────────────────── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                {/* Main headline */}
                <h1 className="rise-in font-display text-[clamp(2.5rem,7.5vw,7rem)] font-bold leading-none tracking-tight my-0 mb-6 max-w-[14ch] [animation-delay:450ms]">
                    <span className="text-nowrap">{m["hero.headline.line1"]()}</span><br />
                    <em className="italic font-light">
                        {m["hero.headline.line2"]()}
                    </em>
                </h1>

                {/* sub */}
                <p className="rise-in font-sans text-[clamp(0.875rem,1.5vw,1.0625rem)] font-light leading-[1.65] text-white/95 max-w-[38ch] my-0 mb-12 [animation-delay:600ms]">
                    {m["hero.subtitle.line1"]()} {m["hero.subtitle.line2"]()}
                </p>

                {/* CTA buttons — glass + solid */}
                <div className="rise-in flex gap-3 flex-wrap justify-center [animation-delay:750ms]">
                    <a
                        href="#projects"
                        className="inline-flex items-center gap-2 font-sans text-sm font-bold tracking-[0.08em] uppercase no-underline px-7 py-[13px] rounded-2xl text-[#1a1916] bg-white/90 backdrop-blur-xl saturate-150 border border-white/60 shadow-[0_4px_16px_rgba(15,14,13,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_28px_rgba(15,14,13,0.24),inset_0_1px_0_white]"
                    >
                        {m["hero.cta.projects"]()}
                        <ArrowRight strokeWidth={1.5} size={14} />
                    </a>

                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 font-sans text-sm font-bold tracking-[0.08em] uppercase no-underline px-7 py-[13px] rounded-2xl text-white bg-white/10 backdrop-blur-xl saturate-150 border border-white/30 shadow-[0_4px_16px_rgba(15,14,13,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50"
                    >
                        {m["hero.cta.contact"]()}
                        <MoveRight strokeWidth={1.5} size={14} />
                    </a>
                </div>
            </div>


            {/* ── Dots pagination — bottom centre ─────────────────── */}
            <div
                role="tablist"
                aria-label={m["aria.slides"]()}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-[10px] bg-white/10 backdrop-blur-xl saturate-150 border border-white/20 rounded-full py-2 px-[14px]"
            >
                {slides.map((_, i) => (
                    <button
                        key={i}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`${m["aria.slide"]()} ${i + 1}`}
                        onClick={() => go(i)}
                        className={cn(
                            "h-1.5 rounded-full border-none p-0 cursor-pointer transition-all duration-400 ease-in-out",
                            i === current ? "w-6 bg-white/95" : "w-1.5 bg-white/35"
                        )}
                    />
                ))}
            </div>

            {/* ── Slide counter — bottom right ────────────────────── */}
            {/* <div className="absolute bottom-10 right-10 z-10 flex items-baseline gap-1">
                <span
                    key={`c-${current}`}
                    className="font-display text-[1.125rem] font-normal text-white/85 animate-[caption-fade_400ms_ease_both] min-w-[1.2ch]"
                >
                    {String(current + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[0.625rem] text-white/35 tracking-widest">
                    / {String(slides.length).padStart(2, "0")}
                </span>
            </div> */}
        </>
    )
}

export function Hero() {
    return (
        <HeroSlider className="h-[calc(100vh-2.5rem)] rounded-3xl">
            <HeroContent />
        </HeroSlider>
    )
}