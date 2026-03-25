import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/engineering'

export const Route = createFileRoute('/services/engineering')({
    component: ServiceEngineeringPage,
})

function ServiceEngineeringPage() {
    return (
        <ServiceLayout
            title={<>Инженерно <em className="italic font-light">Проектиране</em></>}
            subtitle="Пълно инженерно обезпечаване за сигурност и ефективност на вашите сгради."
            heroImage={{
                id: 'eng-1',
                srcS: `${baseUrl}/1_S.webp`,
                srcM: `${baseUrl}/1_M.webp`,
                srcL: `${baseUrl}/1_L.webp`,
                src: `${baseUrl}/1_L.webp`,
                alt: 'Инженерно Проектиране'
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
                <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">Конструкции и системи</h2>
                <p className="text-black/70 mb-4 leading-relaxed">
                    Добрата архитектура се нуждае от надежден инженерен гръбнак. Нашите инженерни раздели
                    разработват иновативни и сигурни решения в сферата на конструкциите, водоснабдяването,
                    ОВК и електроинсталациите, гарантирайки дълголетието на всяка сграда.
                </p>
                <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                    <li>Проектиране на стоманобетонни и метални конструкции</li>
                    <li>Енергийна ефективност и еко-оценки</li>
                    <li>Отопление, вентилация и климатизация (ОВК)</li>
                    <li>ВиК и електрически инсталации</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
