import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/layout/PageHeader'
import type { SlideData } from '#/components/layout/HeroSlider'
import { m } from '../paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

const slides: SlideData[] = [
    {
        id: 'terms-hero',
        srcS: `${baseUrl}/3_S.webp`,
        srcM: `${baseUrl}/3_M.webp`,
        srcL: `${baseUrl}/3_L.webp`,
        src: `${baseUrl}/3_L.webp`,
        alt: m["legal.terms.title"]()
    }
]

export const Route = createFileRoute('/terms')({
    component: TermsPage,
})

function TermsPage() {
    return (
        <main className="w-full min-h-screen pb-24 p-5">
            <PageHeader
                title={<>{m["legal.terms.titleMain"]()} <em className="italic font-light opacity-50">{m["legal.terms.titleSub"]()}</em></>}
                slides={slides}
            />

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                <div className="p-10 md:p-16">
                    <div className="prose prose-stone lg:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/70 prose-p:font-light prose-p:leading-relaxed prose-li:text-foreground/70 prose-li:font-light">
                        <p className="text-sm font-bold tracking-[0.2em] uppercase text-foreground/30 mb-12">
                            {m["legal.terms.lastUpdate"]()}
                        </p>

                        <section className="mb-12">
                            <h2>{m["legal.terms.s1.title"]()}</h2>
                            <p>{m["legal.terms.s1.p1"]()}</p>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.terms.s2.title"]()}</h2>
                            <p>{m["legal.terms.s2.p1"]()}</p>
                            <ul>
                                <li>{m["legal.terms.s2.li1"]()}</li>
                                <li>{m["legal.terms.s2.li2"]()}</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.terms.s3.title"]()}</h2>
                            <p>{m["legal.terms.s3.p1"]()}</p>
                            <ul>
                                <li>{m["legal.terms.s3.li1"]()}</li>
                                <li>{m["legal.terms.s3.li2"]()}</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.terms.s4.title"]()}</h2>
                            <p>{m["legal.terms.s4.p1"]()}</p>
                            <ul>
                                <li>{m["legal.terms.s4.li1"]()}</li>
                                <li>{m["legal.terms.s4.li2"]()}</li>
                                <li>{m["legal.terms.s4.li3"]()}</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2>{m["legal.terms.s5.title"]()}</h2>
                            <p>{m["legal.terms.s5.p1"]()}</p>
                        </section>

                        <section className="mb-0">
                            <h2>{m["legal.terms.s6.title"]()}</h2>
                            <p>{m["legal.terms.s6.p1"]()}</p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08]">
                                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-sm font-medium text-foreground">arh_uzunov@abv.bg</span>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08]">
                                    <span className="text-sm font-medium text-foreground">0887261838</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
