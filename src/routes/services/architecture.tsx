import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/architecture'

export const Route = createFileRoute('/services/architecture')({
    component: ServiceArchitecturePage,
})

function ServiceArchitecturePage() {
    return (
        <ServiceLayout
            title={<>Архитектурно <em className="italic font-light">Проектиране</em></>}
            subtitle="Комплексни архитектурни решения, съобразени с вашите изисквания и съвременните стандарти."
            heroImage={{
                id: 'arch-1',
                srcS: `${baseUrl}/2_S.webp`,
                srcM: `${baseUrl}/2_M.webp`,
                srcL: `${baseUrl}/2_L.webp`,
                src: `${baseUrl}/2_L.webp`,
                alt: 'Архитектурно Проектиране'
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
                <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">От концепция до реализация</h2>
                <p className="text-black/70 mb-4 leading-relaxed">
                    Нашето студио предлага пълен обхват от архитектурни услуги. Ние вярваме, че добрата архитектура
                    балансира между естетика, функционалност и устойчивост, създавайки пространства, които подобряват
                    качеството на живот на своите обитатели.
                </p>
                <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                    <li>Идейни проекти и градоустройствени концепции</li>
                    <li>Технически и работни проекти за всички видове сгради</li>
                    <li>Реконструкция и адаптация на съществуващи обекти</li>
                    <li>Проектиране на обществени, жилищни и индустриални сгради</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
