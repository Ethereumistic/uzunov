import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import {
    Building2,
    PenTool,
    Cog,
    MessageSquare,
    Box,
    ClipboardCheck,
    Quote,
    Target,
    Eye,
    Lightbulb
} from 'lucide-react'

// Services data
const services = [
    {
        title: 'Архитектура',
        description: 'Цялостни архитектурни решения от концепция до реализация.',
        icon: Building2,
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80'
    },
    {
        title: 'Интериорен дизайн',
        description: 'Индивидуални проекти за пространства, съчетаващи стил и комфорт.',
        icon: PenTool,
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'
    },
    {
        title: 'Инженерно проектиране',
        description: 'Прецизни инженерни планове и техническа документация.',
        icon: Cog,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80'
    },
    {
        title: 'Консултиране',
        description: 'Професионални съвети и експертно мнение за вашия проект.',
        icon: MessageSquare,
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
    },
    {
        title: '3D Анимация и VR',
        description: 'Фотореалистични визуализации и потапящи VR преживявания.',
        icon: Box,
        image: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?w=800&q=80'
    },
    {
        title: 'Управление на проекти',
        description: 'Координация и контрол на целия инвестиционен процес.',
        icon: ClipboardCheck,
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=800&q=80'
    }
]

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
        description: 'Вярваме, че архитектурата е изкуство да се създават пространства, които вдъхновяват, функционални решения, които издържат времето, и устойчиви среди, които уважават природата.',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
    },
    {
        title: 'Мисия',
        description: 'Да трансформираме визиите на нашите клиенти в реалност чрез иновативно проектиране, прецизно изпълнение и ненадминато качество на всяка стъпка от процеса.',
        icon: Target,
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
    },
    {
        title: 'Визия',
        description: 'Да бъдем водеща архитектурна фирма в България, призната за творчески подход, техническо съвършенство и устойчиви решения, които оформят градската среда на бъдещето.',
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
                            className="group relative overflow-hidden border-white/60 bg-white/40 backdrop-blur-xl transition-all duration-700 hover:bg-white/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] rounded-3xl"
                        >
                            {/* Card background image on hover */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <div
                                    className="h-full w-full bg-cover bg-center grayscale opacity-0 transition-all duration-900 ease-out group-hover:grayscale-0 group-hover:opacity-15 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${value.image})` }}
                                />
                            </div>

                            <CardContent className="relative z-10 p-8">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5 transition-transform duration-500 group-hover:-translate-y-1">
                                    <value.icon className="h-6 w-6 text-zinc-800" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#1a1916] tracking-tight">{value.title}</h3>
                                <p className="text-[0.9375rem] leading-relaxed text-zinc-500 font-light">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Services Section */}
                <div className="mb-28">
                    <div className="mb-14 text-center">
                        <p className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-black/35 mb-3">
                            Какво правим
                        </p>
                        <h2 className="text-4xl font-bold text-[#1a1916] tracking-tight">
                            Нашите <span className="font-light italic">Услуги</span>
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-black/5 bg-stone-50/50 backdrop-blur-sm transition-all duration-700 hover:border-black/10 hover:bg-white hover:shadow-xl rounded-2xl"
                            >
                                {/* Service Image Background */}
                                <div className="absolute inset-0 z-0 overflow-hidden">
                                    <div
                                        className="h-full w-full bg-cover bg-center grayscale opacity-0 transition-all duration-900 ease-out group-hover:grayscale-0 group-hover:opacity-10 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${service.image})` }}
                                    />
                                </div>

                                <CardContent className="relative z-10 p-8">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-black/5 transition-all duration-500 group-hover:bg-zinc-900 group-hover:text-white group-hover:-translate-y-1">
                                        <service.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mb-2.5 text-lg font-bold text-[#1a1916] tracking-tight">{service.title}</h3>
                                    <p className="text-sm leading-relaxed text-zinc-500 font-light">{service.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mb-24">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/30 p-10 backdrop-blur-2xl sm:p-16">
                        {/* Decorative quote icon */}
                        <Quote className="absolute right-12 top-12 h-24 w-24 text-black/5 opacity-40" />

                        <div className="relative z-10">
                            <div className="mb-14 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-[#1a1916] tracking-tight">
                                    Студиото в <span className="font-light italic">цифри</span>
                                </h2>
                                <p className="mx-auto max-w-xl text-zinc-500 font-light">
                                    Дългогодишният опит и стотиците проектирани пространства са гаранция за нашето качество и прецизност.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-3">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center group">
                                        <div className="mb-2 text-6xl font-bold text-[#1a1916] tracking-tighter transition-transform duration-700 group-hover:scale-105">
                                            {stat.value}
                                        </div>
                                        <div className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-black/30">
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