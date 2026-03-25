import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'
import type { SlideData } from '#/components/layout/HeroSlider'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

const slides: SlideData[] = [
    {
        id: 'terms-hero',
        srcS: `${baseUrl}/3_S.webp`,
        srcM: `${baseUrl}/3_M.webp`,
        srcL: `${baseUrl}/3_L.webp`,
        src: `${baseUrl}/3_L.webp`,
        alt: 'Общи условия'
    }
]

export const Route = createFileRoute('/terms')({
    component: TermsPage,
})

function TermsPage() {
    return (
        <main className="w-full min-h-screen  pb-24 p-5">
            <PageHeader
                title={<>Общи <em className="italic font-light opacity-50">условия</em></>}
                slides={slides}
            />

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                <div className="relative group">
                    {/* Apple-style Glassmorphism Card */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl saturate-200 border border-white/40 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,14,13,0.12)] -z-10 transition-all duration-700 group-hover:shadow-[0_48px_80px_-16px_rgba(15,14,13,0.16)]" />

                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/80 to-transparent z-10" />

                    <div className="relative p-10 md:p-16">
                        <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-p:text-ink-soft prose-p:font-light prose-p:leading-relaxed prose-li:text-ink-soft prose-li:font-light">
                            <p className="text-sm font-bold tracking-[0.2em] uppercase text-ink/30 mb-12">
                                Последна актуализация: 25.03.2026г.
                            </p>

                            <section className="mb-12">
                                <h2>1. Общи разпоредби</h2>
                                <p>
                                    С достъпа и използването на този уебсайт Вие се съгласявате да спазвате настоящите Общи условия.
                                    Уебсайтът е собственост на <strong>УЗУНОВ ПРОЕКТ ЕООД</strong>, ЕИК 107562605.
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-accent underline decoration-accent/20 underline-offset-8">2. Интелектуална собственост</h2>
                                <p>
                                    Цялото съдържание на този уебсайт – включително, но не само: архитектурни проекти, чертежи,
                                    фотографии, графики, лога, текстове и дизайн – е изключителна интелектуална собственост на
                                    <strong> УЗУНОВ ПРОЕКТ ЕООД</strong>.
                                </p>
                                <ul className="list-disc pl-5 marker:text-accent/40">
                                    <li>Забранява се копирането, разпространението, модифицирането или използването на каквато и да е част от съдържанието без изричното писмено съгласие на собственика.</li>
                                    <li>Нарушението на тези права подлежи на законова отговорност съгласно Закона за авторското право и сродните му права.</li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2>3. Използване на уебсайта</h2>
                                <p>Сайтът е създаден с цел представяне на портфолиото и услугите на компанията.</p>
                                <ul>
                                    <li>Потребителите се задължават да не използват контактните форми за изпращане на спам, нежелани търговски съобщения (SPAM) или зловреден софтуер.</li>
                                    <li>Всяко неправомерно действие, насочено към нарушаване на работата на сайта, е строго забранено.</li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2>4. Ограничаване на отговорността</h2>
                                <p>Въпреки че се стремим информацията в нашето портфолио да бъде точна и актуална:</p>
                                <ul>
                                    <li>УЗУНОВ ПРОЕКТ ЕООД не носи отговорност за евентуални грешки или пропуски в съдържанието.</li>
                                    <li>Представените проекти са с информативна цел и не представляват директна търговска оферта до момента на подписване на конкретен индивидуален договор за проектиране.</li>
                                    <li>Компанията не носи отговорност за претърпени вреди в резултат на технически проблеми или достъп до външни линкове.</li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2>5. Промени в условията</h2>
                                <p>
                                    <strong>УЗУНОВ ПРОЕКТ ЕООД</strong> си запазва правото да актуализира и променя тези Общи условия по всяко време
                                    без предварително известие. Новите условия влизат в сила в момента на тяхното публикуване на уебсайта.
                                </p>
                            </section>

                            <section className="mb-0">
                                <h2>6. Контакти</h2>
                                <p>За въпроси относно тези условия, можете да се свържете с нас на:</p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-stone-100/50 border border-stone-200/50">
                                        <div className="size-2 rounded-full bg-accent animate-pulse" />
                                        <span className="text-sm font-medium text-ink">arh_uzunov@abv.bg</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-stone-100/50 border border-stone-200/50">
                                        <span className="text-sm font-medium text-ink">0887261838</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
