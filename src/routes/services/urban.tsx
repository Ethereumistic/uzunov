import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'
import { m } from '#/paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/interior'

export const Route = createFileRoute('/services/urban')({
    component: ServiceUrbanPage,
})

function ServiceUrbanPage() {
    return (
        <ServiceLayout
            titleKey="service.urban.title"
            subtitleKey="service.urban.subtitle"
            ctaHeadingKey="cta.haveIdea"
            ctaDescKey="cta.contactConsultation"
            ctaButtonKey="cta.contactUs"
            heroImage={{
                id: 'urban-1',
                srcS: `${baseUrl}/1_S.webp`,
                srcM: `${baseUrl}/1_M.webp`,
                srcL: `${baseUrl}/1_L.webp`,
                src: `${baseUrl}/1_L.webp`,
                alt: m["services.urban.title"](),
            }}
            bentoImages={[
                `${baseUrl}/2_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/4_S.webp`,
                `${baseUrl}/5_S.webp`
            ]}
            ctaImage={`${baseUrl}/6_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-foreground">{m["service.urban.heading"]()}</h2>
                <p className="text-foreground/90 mb-4 leading-relaxed">
                    {m["service.urban.intro"]()}
                </p>
                <ul className="list-disc pl-5 text-foreground/90 space-y-2 mb-8 marker:text-foreground/90">
                    <li>{m["service.urban.item1"]()}</li>
                    <li>{m["service.urban.item2"]()}</li>
                    <li>{m["service.urban.item3"]()}</li>
                    <li>{m["service.urban.item4"]()}</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}