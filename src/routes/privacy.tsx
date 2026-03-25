import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'
import type { SlideData } from '#/components/layout/HeroSlider'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

const slides: SlideData[] = [
    {
        id: 'privacy-hero',
        srcS: `${baseUrl}/2_S.webp`,
        srcM: `${baseUrl}/2_M.webp`,
        srcL: `${baseUrl}/2_L.webp`,
        src: `${baseUrl}/2_L.webp`,
        alt: 'Политика за поверителност'
    }
]

export const Route = createFileRoute('/privacy')({
    component: PrivacyPage,
})

function PrivacyPage() {
    return (
        <main className="w-full min-h-screen p-5">
            <PageHeader
                title={<>Политика за <em className="italic font-light opacity-50">поверителност</em></>}
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
                                <h2>1. Данни за администратора на лични данни</h2>
                                <p>Администратор на личните данни, събирани чрез този уебсайт, е:</p>
                                <div className="not-prose grid gap-4 p-6 rounded-2xl bg-stone-100/50 border border-stone-200/50 mt-6 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    </div>
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Наименование</span>
                                        <span className="font-bold text-ink">УЗУНОВ ПРОЕКТ ЕООД</span>
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <p className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">ЕИК</span>
                                            <span className="font-medium text-ink">107562605</span>
                                        </p>
                                        <p className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">ИН по ЗДДС</span>
                                            <span className="font-medium text-ink">BG107562605</span>
                                        </p>
                                    </div>
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Адрес на управление</span>
                                        <span className="font-medium text-ink">БЪЛГАРИЯ, гр. Габрово, бул. АПРИЛОВ 46, ет. 7, офис 18</span>
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <p className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Телефон</span>
                                            <span className="font-medium text-ink">0887261838</span>
                                        </p>
                                        <p className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Email</span>
                                            <span className="font-medium text-ink">arh_uzunov@abv.bg</span>
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <h2>2. Какви данни събираме и защо</h2>
                                <p>
                                    Нашият уебсайт е тип „портфолио“ и има чисто информативен характер. Ние събираме минимално
                                    количество лични данни, само когато Вие решите да се свържете с нас чрез секцията за контакти.
                                </p>
                                <p><strong>Данни, събирани чрез контактната форма:</strong></p>
                                <ul>
                                    <li>Име (за да знаем как да се обръщаме към Вас);</li>
                                    <li>Електронен адрес (за да можем да Ви отговорим);</li>
                                    <li>Тема и съдържание на Вашето съобщение.</li>
                                </ul>
                                <p>
                                    <strong>Цел на обработката:</strong> Данните се използват единствено за комуникация с Вас и
                                    предоставяне на информация относно нашите архитектурни услуги в отговор на Вашето запитване.
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2>3. Трети страни и обработка на данни</h2>
                                <p>
                                    За функционирането на контактната форма използваме услугата <strong>Web3Forms</strong>.
                                    Тя служи като технически посредник, който препраща Вашето съобщение директно към официалната
                                    ни електронна поща (arh_uzunov@abv.bg). Web3Forms не съхранява Вашите данни за свои цели.
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2>4. Срок на съхранение</h2>
                                <p>
                                    Ние съхраняваме Вашето име и имейл адрес само за периода, необходим за обработка на Вашето запитване.
                                    В случай че комуникацията не доведе до сключване на договор, данните Ви ще бъдат изтрити в
                                    рамките на разумни срокове, освен ако законът не изисква друго.
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2>5. Вашите права (съгласно GDPR)</h2>
                                <p>Като субект на данни, Вие имате следните права:</p>
                                <ul>
                                    <li><strong>Право на достъп:</strong> Можете да поискате информация за това какви Ваши данни съхраняваме.</li>
                                    <li><strong>Право на коригиране:</strong> Можете да поискате поправка на неточни данни.</li>
                                    <li><strong>Право на изтриване („да бъдеш забравен“):</strong> Можете да поискате изтриване на Вашите данни.</li>
                                    <li><strong>Право на ограничаване на обработката:</strong> В определени ситуации можете да ограничите начина, по който ползваме данните Ви.</li>
                                    <li><strong>Право на жалба:</strong> Имате право да подадете жалба до надзорния орган – Комисия за защита на личните данни (КЗЛД).</li>
                                </ul>
                            </section>

                            <section className="mb-0">
                                <h2>6. Политика за бисквитките (Cookies)</h2>
                                <p>
                                    Този уебсайт използва единствено <strong>строго необходими технически бисквитки</strong>,
                                    които осигуряват правилната работа на сайта и сигурността на навигацията. Ние не използваме
                                    бисквитки за маркетингови цели или проследяване на поведението на потребителите.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
