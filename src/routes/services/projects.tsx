import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/projects'

export const Route = createFileRoute('/services/projects')({
    component: ServiceProjectsPage,
})

function ServiceProjectsPage() {
    return (
        <ServiceLayout
            title={<>Управление на <em className="italic font-light">Проекти</em></>}
            subtitle="Оптимално планиране и контрол на строителния процес от начало до край."
            heroImage={{
                id: 'pm-1',
                srcS: `${baseUrl}/5_S.webp`,
                srcM: `${baseUrl}/5_M.webp`,
                srcL: `${baseUrl}/5_L.webp`,
                src: `${baseUrl}/5_L.webp`,
                alt: 'Управление на Проекти'
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
                <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">Контрол и координация</h2>
                <p className="text-black/70 mb-4 leading-relaxed">
                    За нас управлението на проекти означава пълно покриване на цикъла – от
                    концептуалната фаза до предаването на ключа. Следим за стриктното спазване на срокове,
                    бюджети и качество.
                </p>
                <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                    <li>Инвеститорски контрол по време на строителството</li>
                    <li>Изготвяне на бюджети и графици за изпълнение</li>
                    <li>Координация между всички участници в процеса</li>
                    <li>Организация на тръжни процедури и избор на изпълнители</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
