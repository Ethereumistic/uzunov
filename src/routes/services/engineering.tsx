import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'
import { m } from '#/paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/engineering'

export const Route = createFileRoute('/services/engineering')({
    component: ServiceEngineeringPage,
})

function ServiceEngineeringPage() {
    return (
        <ServiceLayout
            titleKey="service.engineering.title"
            subtitleKey="service.engineering.subtitle"
            ctaHeadingKey="cta.haveIdea"
            ctaDescKey="cta.contactConsultation"
            ctaButtonKey="cta.contactUs"
            heroImage={{
                id: 'eng-1',
                srcS: `${baseUrl}/1_S.webp`,
                srcM: `${baseUrl}/1_M.webp`,
                srcL: `${baseUrl}/1_L.webp`,
                src: `${baseUrl}/1_L.webp`,
                alt: m["services.engineering.title"](),
            }}
            bentoImages={[
                `${baseUrl}/2_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/6_S.webp`,
                `${baseUrl}/5_S.webp`
            ]}
            ctaImage={`${baseUrl}/4_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-foreground">{m["service.engineering.heading"]()}</h2>
                <p className="text-foreground/90 mb-4 leading-relaxed">
                    {m["service.engineering.intro"]()}
                </p>
                <ul className="list-disc pl-5 text-foreground/90 space-y-2 mb-8 marker:text-foreground/90">
                    <li>{m["service.engineering.item1"]()}</li>
                    <li>{m["service.engineering.item2"]()}</li>
                    <li>{m["service.engineering.item3"]()}</li>
                    <li>{m["service.engineering.item4"]()}</li>
                    <li>{m["service.engineering.item5"]()}</li>
                    <li>{m["service.engineering.item6"]()}</li>
                    <li>{m["service.engineering.item7"]()}</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
