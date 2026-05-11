import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'
import { m } from '#/paraglide/messages'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/projects'

export const Route = createFileRoute('/services/projects')({
    component: ServiceProjectsPage,
})

function ServiceProjectsPage() {
    return (
        <ServiceLayout
            titleKey="service.projects.title"
            subtitleKey="service.projects.subtitle"
            ctaHeadingKey="cta.haveIdea"
            ctaDescKey="cta.contactConsultation"
            ctaButtonKey="cta.contactUs"
            heroImage={{
                id: 'pm-1',
                srcS: `${baseUrl}/5_S.webp`,
                srcM: `${baseUrl}/5_M.webp`,
                srcL: `${baseUrl}/5_L.webp`,
                src: `${baseUrl}/5_L.webp`,
                alt: m["services.projectManagement.title"](),
            }}
            bentoImages={[
                `${baseUrl}/2_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/4_S.webp`,
                `${baseUrl}/1_S.webp`
            ]}
            ctaImage={`${baseUrl}/6_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-foreground">{m["service.projects.heading"]()}</h2>
                <p className="text-foreground/90 mb-4 leading-relaxed">
                    {m["service.projects.intro"]()}
                </p>
                <ul className="list-disc pl-5 text-foreground/90 space-y-2 mb-8 marker:text-foreground/90">
                    <li>{m["service.projects.item1"]()}</li>
                    <li>{m["service.projects.item2"]()}</li>
                    <li>{m["service.projects.item3"]()}</li>
                    <li>{m["service.projects.item4"]()}</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
