import { useEffect, useState, useCallback, useRef } from "react"
import { ArrowRight, MoveRight } from "lucide-react"
import { cn } from "../../lib/utils"

/* ──────────────────────────────────────────────────────────────────
   Slide data
   Replace `src` with real image URLs / imports.
   Using high-quality Unsplash architectural images as placeholders.
 ────────────────────────────────────────────────────────────────── */
const slides = [
    {
        id: 0,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/scentia/scientia-slide3.webp",
        alt: "Модерна архитектура — фасада",
        caption: "Форма среща функция",
    },
    {
        id: 1,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/mall/1.webp",
        alt: "Интериор с естествена светлина",
        caption: "Пространство и светлина",
    },
    {
        id: 2,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/vasilii-veliki/3.webp",
        alt: "Резиденция с минималистичен дизайн",
        caption: "Детайлът прави разлика",
    },
    {
        id: 3,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/scentia/scientia-slide1.webp",
        alt: "Обществена сграда, бетон и стъкло",
        caption: "Трайност, изработена с намерение",
    },
    {
        id: 4,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/vasilii-veliki/4.webp",
        alt: "Обществена сграда, бетон и стъкло",
        caption: "Трайност, изработена с намерение",
    },
    {
        id: 5,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/vasilii-veliki/7.webp",
        alt: "Обществена сграда, бетон и стъкло",
        caption: "Трайност, изработена с намерение",
    },
    {
        id: 6,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/vasilii-veliki/5.webp",
        alt: "Обществена сграда, бетон и стъкло",
        caption: "Трайност, изработена с намерение",
    },
    {
        id: 7,
        src: "https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/scentia/slide4.webp",
        alt: "Обществена сграда, бетон и стъкло",
        caption: "Трайност, изработена с намерение",
    },
]

const AUTOPLAY_MS = 5500
const TRANSITION_MS = 900

export function Hero() {
    const [current, setCurrent] = useState(0)
    const [prev, setPrev] = useState<number | null>(null)
    const [animating, setAnimating] = useState(false)
    const [paused, setPaused] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()

    const go = useCallback(
        (idx: number) => {
            if (animating || idx === current) return
            setPrev(current)
            setCurrent(idx)
            setAnimating(true)
            setTimeout(() => {
                setPrev(null)
                setAnimating(false)
            }, TRANSITION_MS)
        },
        [animating, current]
    )

    /* autoplay */
    useEffect(() => {
        if (paused) return
        timerRef.current = setTimeout(
            () => go((current + 1) % slides.length),
            AUTOPLAY_MS
        )
        return () => clearTimeout(timerRef.current)
    }, [current, paused, go])

    return (
        <section
            className="relative w-full h-[calc(100vh-2.5rem)] overflow-hidden bg-[#0f0e0d] rounded-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-label="Карусел с архитектурни проекти"
        >
            {/* ── Slides ──────────────────────────────────────────── */}
            {slides.map((slide, i) => {
                const isCurrent = i === current
                const isPrev = i === prev

                return (
                    <div
                        key={slide.id}
                        aria-hidden={!isCurrent}
                        className={cn(
                            "absolute inset-0 transition-opacity",
                            isCurrent ? "z-2" : isPrev ? "z-1" : "z-0"
                        )}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className={cn(
                                "w-full h-full object-cover object-center will-change-[opacity,transform]",
                                isCurrent ? "opacity-100 scale-[1.02]" : isPrev ? "opacity-100 scale-100" : "opacity-0 scale-[1.06]"
                            )}
                            style={{
                                transition: isCurrent
                                    ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS + 3000}ms cubic-bezier(0.16,1,0.3,1)`
                                    : isPrev
                                        ? `opacity ${TRANSITION_MS}ms ease`
                                        : "none",
                            }}
                        />

                        {/* gradient scrim */}
                        <div className="absolute inset-0 bg-linear-to-b from-[#0f0e0d]/13 via-[#0f0e0d]/45  to-[#0f0e0d]/13" />
                    </div>
                )
            })}

            {/* ── Centre content ──────────────────────────────────── */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">


                {/* Main headline */}
                <h1 className="rise-in font-display text-[clamp(2.5rem,7.5vw,7rem)] font-bold leading-none tracking-tight text-white my-0 mb-6 max-w-[14ch] [animation-delay:450ms]">
                    Пространства,<br />
                    <em className="italic font-light">
                        изградени с намерение
                    </em>
                </h1>

                {/* sub */}
                <p className="rise-in font-sans text-[clamp(0.875rem,1.5vw,1.0625rem)] font-light leading-[1.65] text-white/65 max-w-[38ch] my-0 mb-12 [animation-delay:600ms]">
                    Проектираме архитектура, която свързва хората с пространството —
                    минималистична, трайна, с душа.
                </p>

                {/* CTA buttons — glass + solid */}
                <div className="rise-in flex gap-3 flex-wrap justify-center [animation-delay:750ms]">
                    {/* Primary ghost CTA */}
                    <a
                        href="#projects"
                        className="inline-flex items-center gap-2 font-sans text-[0.75rem] font-medium tracking-[0.08em] uppercase no-underline px-7 py-[13px] rounded-full text-[#1a1916] bg-white/90 backdrop-blur-xl saturate-150 border border-white/60 shadow-[0_4px_16px_rgba(15,14,13,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_28px_rgba(15,14,13,0.24),inset_0_1px_0_white]"
                    >
                        Нашите проекти
                        <ArrowRight strokeWidth={1.5} size={14} />
                    </a>

                    {/* Secondary outline CTA */}
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 font-sans text-[0.75rem] font-medium tracking-[0.08em] uppercase no-underline px-7 py-[13px] rounded-full text-white bg-white/10 backdrop-blur-xl saturate-150 border border-white/30 shadow-[0_4px_16px_rgba(15,14,13,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50"
                    >
                        Свържете се
                        <MoveRight strokeWidth={1.5} size={14} />
                    </a>
                </div>
            </div>

            {/* ── Slide caption — bottom left ─────────────────────── */}
            <div className="absolute bottom-10 left-10 z-10">
                <p
                    key={current}
                    className="font-sans text-[0.6875rem] font-normal tracking-widest uppercase text-white/45 m-0 animate-[caption-fade_600ms_ease_both]"
                >
                    {slides[current].caption}
                </p>
            </div>

            {/* ── Dots pagination — bottom centre ─────────────────── */}
            <div
                role="tablist"
                aria-label="Слайдове"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-[10px] bg-white/10 backdrop-blur-xl saturate-150 border border-white/20 rounded-full py-2 px-[14px]"
            >
                {slides.map((_, i) => (
                    <button
                        key={i}
                        role="tab"
                        aria-selected={i === current}
                        aria-label={`Слайд ${i + 1}`}
                        onClick={() => go(i)}
                        className={cn(
                            "h-1.5 rounded-full border-none p-0 cursor-pointer transition-all duration-400 ease-in-out",
                            i === current ? "w-6 bg-white/95" : "w-1.5 bg-white/35"
                        )}
                    />
                ))}
            </div>

            {/* ── Slide counter — bottom right ────────────────────── */}
            <div className="absolute bottom-10 right-10 z-10 flex items-baseline gap-1">
                <span
                    key={`c-${current}`}
                    className="font-display text-[1.125rem] font-normal text-white/85 animate-[caption-fade_400ms_ease_both] min-w-[1.2ch]"
                >
                    {String(current + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[0.625rem] text-white/35 tracking-widest">
                    / {String(slides.length).padStart(2, "0")}
                </span>
            </div>

            <style>{`
        @keyframes caption-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    )
}