import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'
import type { SlideData } from '#/components/layout/HeroSlider'
import { m } from '../paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

const slides: SlideData[] = [
    {
        id: 'privacy-hero',
        srcS: `${baseUrl}/2_S.webp`,
        srcM: `${baseUrl}/2_M.webp`,
        srcL: `${baseUrl}/2_L.webp`,
        src: `${baseUrl}/2_L.webp`,
        alt: m["legal.privacy.title"]()
    }
]

export const Route = createFileRoute('/privacy')({
    component: PrivacyPage,
})

function PrivacyPage() {
    return (
        <main className="w-full min-h-screen p-5">
            <PageHeader
                title={<>{m["legal.privacy.titleMain"]()} <em className="italic font-light opacity-50">{m["legal.privacy.titleSub"]()}</em></>}
                slides={slides}
            />

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                <div className="p-10 md:p-16">
                    <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/70 prose-p:font-light prose-p:leading-relaxed prose-li:text-foreground/70 prose-li:font-light">
                        <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground/30 mb-12">
                            {m["legal.privacy.lastUpdate"]()}
                        </p>

                        <section className="mb-12">
                            <h2>{m["legal.privacy.s1.title"]()}</h2>
                            <p>{m["legal.privacy.s1.p1"]()}</p>
                            <div className="not-prose grid gap-4 p-6 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08] mt-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none select-none">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <p className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.companyName"]()}</span>
                                    <span className="font-bold text-foreground">{m["legal.privacy.s1.company"]()}</span>
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.eik"]()}</span>
                                        <span className="font-medium text-foreground">{m["legal.privacy.s1.eikValue"]()}</span>
                                    </p>
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.vat"]()}</span>
                                        <span className="font-medium text-foreground">{m["legal.privacy.s1.vatValue"]()}</span>
                                    </p>
                                </div>
                                <p className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.address"]()}</span>
                                    <span className="font-medium text-foreground">{m["legal.privacy.s1.addressValue"]()}</span>
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.phone"]()}</span>
                                        <span className="font-medium text-foreground">{m["legal.privacy.s1.phoneValue"]()}</span>
                                    </p>
                                    <p className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{m["legal.privacy.s1.email"]()}</span>
                                        <span className="font-medium text-foreground">{m["legal.privacy.s1.emailValue"]()}</span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.privacy.s2.title"]()}</h2>
                            <p>{m["legal.privacy.s2.p1"]()}</p>
                            <p><strong>{m["legal.privacy.s2.p2"]()}</strong></p>
                            <ul>
                                <li>{m["legal.privacy.s2.li1"]()}</li>
                                <li>{m["legal.privacy.s2.li2"]()}</li>
                                <li>{m["legal.privacy.s2.li3"]()}</li>
                            </ul>
                            <p>{m["legal.privacy.s2.p3"]()}</p>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.privacy.s3.title"]()}</h2>
                            <p>{m["legal.privacy.s3.p1"]()}</p>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.privacy.s4.title"]()}</h2>
                            <p>{m["legal.privacy.s4.p1"]()}</p>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.privacy.s5.title"]()}</h2>
                            <p>{m["legal.privacy.s5.p1"]()}</p>
                            <ul>
                                <li>{m["legal.privacy.s5.li1"]()}</li>
                                <li>{m["legal.privacy.s5.li2"]()}</li>
                                <li>{m["legal.privacy.s5.li3"]()}</li>
                                <li>{m["legal.privacy.s5.li4"]()}</li>
                                <li>{m["legal.privacy.s5.li5"]()}</li>
                            </ul>
                        </section>

                        <section className="mb-0">
                            <h2>{m["legal.privacy.s6.title"]()}</h2>
                            <p>{m["legal.privacy.s6.p1"]()}</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
