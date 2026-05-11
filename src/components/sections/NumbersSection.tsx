import { useEffect, useState, useRef } from 'react'
import { m } from '#/paraglide/messages'

interface Stat {
    value: string
    labelKey: string
}

const stats: Stat[] = [
    { value: '20+', labelKey: 'numbers.years' },
    { value: '300+', labelKey: 'numbers.projectsCount' },
    { value: '250+', labelKey: 'numbers.clients' }
]

function AnimatedNumber({ value }: { value: string }) {
    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    // Parse the numeric part and the suffix
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
    const suffix = value.replace(/[0-9]/g, '')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [hasAnimated])

    useEffect(() => {
        if (!hasAnimated) return

        let startTimestamp: number | null = null
        const duration = 2000 // 2 seconds animation

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)

            // Ease out expo for a premium feel
            const easeOutExpo = (x: number): number => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
            }

            const currentCount = Math.floor(easeOutExpo(progress) * numericValue)
            setDisplayValue(currentCount)

            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }

        window.requestAnimationFrame(step)
    }, [hasAnimated, numericValue])

    return (
        <span ref={elementRef} className="tabular-nums">
            {displayValue}{suffix}
        </span>
    )
}

export function NumbersSection() {
    return (
        <section className="w-full pb-24 px-0 md:px-5">
            <div className="mx-auto max-w-6xl">
                <div className="group relative overflow-hidden rounded-[2.5rem] border-0 bg-transparent p-10 sm:p-20">
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-2000 ease-out scale-100 md:scale-150 md:group-hover:scale-145"
                            style={{ backgroundImage: `url('https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture/1_L.webp')` }}
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/20 transition-opacity duration-700" />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-20 text-center">
                            <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] tracking-tight text-white drop-shadow-md">
                                {(() => {
                                    const t = m["numbers.title"]()
                                    const words = t.split(' ')
                                    return <>{words.slice(0, 2).join(' ')}{words.length > 2 && <span className="font-bold"> {words.slice(2).join(' ')}</span>}</>
                                })()}
                            </h2>
                            <p className="md:flex hidden mx-auto max-w-2xl text-lg text-white/80 font-light leading-relaxed drop-shadow-sm">
                                {m["numbers.description"]()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-y-16 gap-x-12 sm:grid-cols-3">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center text-center group/stat">
                                    <div className="mb-8 inline-flex h-32 min-w-48 px-10 items-center justify-center rounded-[2rem] bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl transition-all duration-700 group-hover/stat:scale-105 group-hover/stat:bg-white/30">
                                        <span className="xl:text-6xl lg:text-5xl md:text-4xl text-4xl text-nowrap font-bold text-white tracking-tighter drop-shadow-sm">
                                            <AnimatedNumber value={stat.value} />
                                        </span>
                                    </div>
                                    <div className="text-[0.75rem] text-nowrap font-bold uppercase tracking-[0.3em] text-white/70 drop-shadow-md">
                                        {m[stat.labelKey as keyof typeof m]()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
