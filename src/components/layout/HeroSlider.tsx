import { useEffect, useState, useCallback, useRef, createContext, useContext } from "react"
import { cn } from "../../lib/utils"
import { heroSlides } from "../../data/hero-slides"

const AUTOPLAY_MS = 5500
const TRANSITION_MS = 900

export interface SlideData {
    id: string | number;
    src?: string;
    srcS?: string;
    srcM?: string;
    srcL?: string;
    alt?: string;
    caption?: string;
}

interface HeroSliderContextType {
    current: number;
    go: (idx: number) => void;
    slides: SlideData[];
}

const HeroSliderContext = createContext<HeroSliderContextType | null>(null);

export function useHeroSlider() {
    const ctx = useContext(HeroSliderContext);
    if (!ctx) throw new Error("useHeroSlider must be used within HeroSlider");
    return ctx;
}

interface HeroSliderProps {
    className?: string;
    children?: React.ReactNode;
    slides?: SlideData[];
    // Callback to let the parent know which slide is active (for counter/dots)
    onSlideChange?: (index: number) => void;
    // Allow parent to control the slide
    externalCurrent?: number;
    externalGo?: (idx: number) => void;
}

export function HeroSlider({ 
    className, 
    children, 
    slides,
    onSlideChange,
    externalCurrent,
    externalGo
}: HeroSliderProps) {
    const [internalCurrent, setInternalCurrent] = useState(0)
    const [prev, setPrev] = useState<number | null>(null)
    const [animating, setAnimating] = useState(false)
    const [paused, setPaused] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    const displaySlides = (slides || heroSlides) as SlideData[];

    // Determine which current/go to use
    const current = externalCurrent !== undefined ? externalCurrent : internalCurrent
    const setCurrent = useCallback((idx: number) => {
        setInternalCurrent(idx)
        onSlideChange?.(idx)
    }, [onSlideChange])

    const go = useCallback(
        (idx: number) => {
            if (animating || idx === current) return
            
            setPrev(current)
            if (externalGo) {
                externalGo(idx)
            } else {
                setCurrent(idx)
            }
            setAnimating(true)
            
            setTimeout(() => {
                setPrev(null)
                setAnimating(false)
            }, TRANSITION_MS)
        },
        [animating, current, externalGo, setCurrent]
    )

    /* autoplay only if NOT controlled externally or if we want internal autoplay */
    useEffect(() => {
        if (paused || (externalGo && externalCurrent !== undefined)) return
        timerRef.current = setTimeout(
            () => go((current + 1) % displaySlides.length),
            AUTOPLAY_MS
        )
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [current, paused, go, externalGo, externalCurrent, displaySlides.length])

    return (
        <HeroSliderContext.Provider value={{ current, go, slides: displaySlides }}>
            <section
                className={cn(
                    "relative w-full overflow-hidden bg-[#0f0e0d] transition-all duration-700",
                    className
                )}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                aria-label="Архитектурен визуален панел"
            >
                {/* ── Slides ──────────────────────────────────────────── */}
                {displaySlides.map((slide, i) => {
                    const isCurrent = i === current
                    const isPrev = i === prev
                    const isSingle = displaySlides.length === 1

                    const imgClasses = cn(
                        "w-full h-full object-cover object-center will-change-[opacity,transform]",
                        isSingle ? "animate-breathe opacity-100"
                        : isCurrent ? "opacity-100 scale-[1.02]" 
                        : isPrev ? "opacity-100 scale-100" 
                        : "opacity-0 scale-[1.06]"
                    );
                    const imgStyle = {
                        transition: isSingle ? "none" : isCurrent
                            ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS + 3000}ms cubic-bezier(0.16,1,0.3,1)`
                            : isPrev
                                ? `opacity ${TRANSITION_MS}ms ease`
                                : "none",
                    };

                    return (
                        <div
                            key={slide.id}
                            aria-hidden={!isCurrent}
                            className={cn(
                                "absolute inset-0 transition-opacity",
                                isCurrent ? "z-2" : isPrev ? "z-1" : "z-0"
                            )}
                        >
                            {slide.srcL || slide.srcM || slide.srcS ? (
                                <picture>
                                    {slide.srcL && <source media="(min-width: 1024px)" srcSet={slide.srcL} />}
                                    {slide.srcM && <source media="(min-width: 600px)" srcSet={slide.srcM} />}
                                    <img
                                        src={slide.srcS || slide.src}
                                        alt={slide.alt || ""}
                                        className={imgClasses}
                                        style={imgStyle}
                                    />
                                </picture>
                            ) : (
                                <img
                                    src={slide.src}
                                    alt={slide.alt || ""}
                                    className={imgClasses}
                                    style={imgStyle}
                                />
                            )}

                            {/* gradient scrim */}
                            <div className="absolute inset-0 bg-linear-to-b from-[#0f0e0d]/25 via-[#0f0e0d]/45 to-[#0f0e0d]/40" />
                        </div>
                    )
                })}

                {/* ── Content ─────────────────────────────────────────── */}
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>

                <style>{`
                    @keyframes caption-fade {
                        from { opacity: 0; transform: translateY(4px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .rise-in {
                        animation: rise-in 1.2s cubic-bezier(0.16,1,0.3,1) both;
                    }
                    @keyframes rise-in {
                        from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                        to { opacity: 1; transform: translateY(0); filter: blur(0); }
                    }
                    @keyframes breathe {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    .animate-breathe {
                        animation: breathe 30s ease-in-out infinite;
                    }
                `}</style>
            </section>
        </HeroSliderContext.Provider>
    )
}
