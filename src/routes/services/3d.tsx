import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'
import { m } from '#/paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/3D'

export const Route = createFileRoute('/services/3d')({
    component: Service3dPage,
})

function Service3dPage() {
    return (
        <ServiceLayout
            titleKey="service.3d.title"
            subtitleKey="service.3d.subtitle"
            ctaHeadingKey="cta.haveIdea"
            ctaDescKey="cta.contactConsultation"
            ctaButtonKey="cta.contactUs"
            heroImage={{
                id: '3d-1',
                srcS: `${baseUrl}/2_S.webp`,
                srcM: `${baseUrl}/2_M.webp`,
                srcL: `${baseUrl}/2_L.webp`,
                src: `${baseUrl}/2_L.webp`,
                alt: m["services.3d.title"](),
            }}
            bentoImages={[
                `${baseUrl}/1_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/4_S.webp`,
                `${baseUrl}/6_S.webp`
            ]}
            ctaImage={`${baseUrl}/4_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-foreground">{m["service.3d.heading"]()}</h2>
                <p className="text-foreground/90 mb-4 leading-relaxed">
                    {m["service.3d.intro"]()}
                </p>
                <ul className="list-disc pl-5 text-foreground/90 space-y-2 mb-8 marker:text-foreground/90">
                    <li>{m["service.3d.item1"]()}</li>
                    <li>{m["service.3d.item2"]()}</li>
                    <li>{m["service.3d.item3"]()}</li>
                    <li>{m["service.3d.item4"]()}</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
