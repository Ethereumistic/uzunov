import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'
import { m } from '#/paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

export const Route = createFileRoute('/services/architecture')({
    component: ServiceArchitecturePage,
})

function ServiceArchitecturePage() {
    return (
        <ServiceLayout
            titleKey="service.architecture.title"
            subtitleKey="service.architecture.subtitle"
            ctaHeadingKey="cta.haveIdea"
            ctaDescKey="cta.contactConsultation"
            ctaButtonKey="cta.contactUs"
            heroImage={{
                id: 'arch-1',
                srcS: `${baseUrl}/2_S.webp`,
                srcM: `${baseUrl}/2_M.webp`,
                srcL: `${baseUrl}/2_L.webp`,
                src: `${baseUrl}/2_L.webp`,
                alt: m["services.architecture.title"](),
            }}
            bentoImages={[
                `${baseUrl}/1_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/4_S.webp`,
                `${baseUrl}/5_S.webp`
            ]}
            ctaImage={`${baseUrl}/6_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-foreground">{m["service.architecture.heading"]()}</h2>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                    {m["service.architecture.intro"]()}
                </p>
                <ul className="list-disc pl-5 text-foreground/90 space-y-2 mb-8 marker:text-foreground/90">
                    <li>{m["service.architecture.item1"]()}</li>
                    <li>{m["service.architecture.item2"]()}</li>
                    <li>{m["service.architecture.item3"]()}</li>
                    <li>{m["service.architecture.item4"]()}</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
