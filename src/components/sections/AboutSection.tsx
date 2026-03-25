import { Card } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Target, Eye, Lightbulb } from 'lucide-react'

// Company stats
const stats = [
    { value: '20+', label: 'Години опит' },
    { value: '300+', label: 'Реализирани проекта' },
    { value: '250+', label: 'Доволни клиенти' }
]

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
            {/* Background elements for depth */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-stone-200/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-stone-100/40 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-20 text-center">
                    <Badge variant="outline" className="mb-6 border-black/10 bg-white/50 px-4 py-1.5 text-[0.6875rem] font-semibold tracking-widest uppercase text-black/40 backdrop-blur-sm">
                        Основана 2004
                    </Badge>
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
                                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/50 to-black/80 transition-opacity duration-700" />
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

                {/* Removed Services Section - Now a standalone component */}

                {/* Stats Section */}
                <div className="mb-24">
                    <div className="group relative overflow-hidden rounded-3xl border-0 bg-transparent p-10 sm:p-16">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <div
                                className="h-full w-full bg-cover bg-center transition-transform duration-2000 ease-out scale-125 group-hover:scale-130"
                                style={{ backgroundImage: `url('https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/scentia/scientia-slide4.webp')` }}
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/80 transition-opacity duration-700" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-14 text-center">
                                <h2 className="mb-4 text-4xl font-bold text-white tracking-tight drop-shadow-md">
                                    Студиото в <span className="font-light italic">цифри</span>
                                </h2>
                                <p className="mx-auto max-w-xl text-white/90 font-light drop-shadow-md">
                                    Дългогодишният опит и стотиците проектирани пространства са гаранция за нашето качество и прецизност.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-3">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex flex-col items-center text-center group/stat">
                                        <div className="mb-6 inline-flex h-24 min-w-40 px-8 items-center justify-center rounded-4xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-500 group-hover/stat:scale-110">
                                            <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-sm">{stat.value}</span>
                                        </div>
                                        <div className="text-[0.875rem] font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Info Footer */}
                <div className="pt-10 border-t border-black/5">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[0.6875rem] font-medium tracking-wider uppercase text-black/25">
                        <span className="hover:text-black transition-colors duration-300 cursor-default">УЗУНОВ ПРОЕКТ</span>
                        <span className="hover:text-black transition-colors duration-300 cursor-default">ЕИК: 107562605</span>
                        <span className="hover:text-black transition-colors duration-300 cursor-default">гр. Габрово, бул. Априлов 46</span>
                        <span className="hover:text-black transition-colors duration-300 cursor-default">Основана 2004</span>
                    </div>
                </div>
            </div>
        </section>
    )
}