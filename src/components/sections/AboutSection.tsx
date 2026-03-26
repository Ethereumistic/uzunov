import { Card } from '#/components/ui/card'
import { Target, Eye, Lightbulb } from 'lucide-react'

import { NumbersSection } from './NumbersSection'

// Philosophy, Mission, Vision data
const coreValues = [
    {
        title: 'Философия',
        description: 'Проектираме вдъхновяващи и вечни пространства.', // 46 chars
        icon: Lightbulb,
        image: 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/about/1_S.webp'
    },
    {
        title: 'Мисия',
        description: 'Превръщаме идеите ви в реалност с иновации.', // 43 chars
        icon: Target,
        image: 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/about/2_S.webp'
    },
    {
        title: 'Визия',
        description: 'Оформяме бъдещето с устойчива архитектура.', // 42 chars
        icon: Eye,
        image: 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/about/3_S.webp'
    }
]

export default function AboutSection() {
    return (
        <section id="about" className="relative w-full overflow-hidden pt-24 pb-2 md:pb-5 px-0 md:px-5">
            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
                        <span className="font-light italic text-black/40">За</span> УЗУНОВ ПРОЕКТ
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-stone-500 font-light leading-relaxed">
                        Повече от две десетилетия създаваме архитектурни решения, които вдъхновяват и издържат изпитанието на времето.
                    </p>
                </div>

                {/* Philosophy, Mission, Vision Cards */}
                <div className=" grid gap-2 md:gap-5 md:grid-cols-3">
                    {coreValues.map((value, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden rounded-3xl border-0 bg-transparent h-[440px] flex flex-col justify-end"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <div
                                    className="h-full w-full bg-cover bg-center transition-transform duration-2000 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url(${value.image})` }}
                                />
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/95 transition-opacity duration-700" />
                            </div>

                            {/* Content block */}
                            <div className="relative z-10 p-6 sm:p-8 flex flex-col w-full h-full justify-end overflow-hidden">
                                <div className="flex items-center gap-4 mb-4 transition-transform duration-800 ease-out md:-mb-5 md:group-hover:-translate-y-15">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110 md:h-14 md:w-14">
                                        <value.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md md:text-2xl">{value.title}</h3>
                                </div>
                                <p className="text-base leading-relaxed text-white/90 font-light drop-shadow-md transition-all duration-500 delay-200 ease-out md:opacity-0 md:group-hover:opacity-100 md:absolute md:bottom-2 md:left-8 md:right-8">
                                    {value.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}