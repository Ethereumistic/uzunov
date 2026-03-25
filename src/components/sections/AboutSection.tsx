import { Card } from '#/components/ui/card'
import { Target, Eye, Lightbulb } from 'lucide-react'

import { NumbersSection } from './NumbersSection'

// Philosophy, Mission, Vision data
const coreValues = [
    {
        title: 'Философия',
        description: 'Създаваме вдъхновяващи пространства и функционални решения, които издържат във времето.',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
        title: 'Мисия',
        description: 'Трансформираме вашите визии в реалност чрез иновативно проектиране и прецизно изпълнение.',
        icon: Target,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
    },
    {
        title: 'Визия',
        description: 'Оформяме градската среда чрез творчески подход и устойчиви архитектурни решения.',
        icon: Eye,
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80'
    }
]

export default function AboutSection() {
    return (
        <section id="about" className="relative w-full overflow-hidden py-24 px-5">
            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-[#1a1916]">
                        <span className="font-light italic text-black/40">За</span> Узунов Проект
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-stone-500 font-light leading-relaxed">
                        Повече от две десетилетия създаваме архитектурни решения, които вдъхновяват и издържат изпитанието на времето.
                    </p>
                </div>

                {/* Philosophy, Mission, Vision Cards */}
                <div className="mb-28 grid gap-6 md:grid-cols-3">
                    {coreValues.map((value, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden rounded-3xl border-0 bg-transparent h-[440px] flex flex-col justify-end"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <div
                                    className="h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url(${value.image})` }}
                                />
                                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/60 transition-opacity duration-700" />
                            </div>

                            {/* Content block */}
                            <div className="relative z-10 p-6 sm:p-8 flex flex-col w-full transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover:scale-110">
                                    <value.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-white tracking-tight drop-shadow-md">{value.title}</h3>
                                <p className="text-[0.9375rem] leading-relaxed text-white/90 font-light drop-shadow-md">{value.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}