import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/3D'

export const Route = createFileRoute('/services/3d')({
    component: Service3dPage,
})

function Service3dPage() {
    return (
        <ServiceLayout
            title={<>3D <em className="italic font-light">Визуализации</em></>}
            subtitle="Висококачествени реалистични 3D визуализации за по-ясно разбиране и представяне на вашия проект."
            heroImage={{
                id: '3d-1',
                srcS: `${baseUrl}/2_S.webp`,
                srcM: `${baseUrl}/2_M.webp`,
                srcL: `${baseUrl}/2_L.webp`,
                src: `${baseUrl}/2_L.webp`,
                alt: '3D Визуализации'
            }}
            bentoImages={[
                `${baseUrl}/1_S.webp`,
                `${baseUrl}/5_S.webp`,
                `${baseUrl}/3_S.webp`,
                `${baseUrl}/6_S.webp`
            ]}
            ctaImage={`${baseUrl}/4_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">Фотореализъм и детайл</h2>
                <p className="text-black/70 mb-4 leading-relaxed">
                    Съвременните 3D визуализации са мощен инструмент, който позволява на клиентите ни
                    да видят своя проект преди дори първата копка да бъде направена. Ние създаваме фотореалистични
                    изображения и анимации, които разкриват пълния потенциал на архитектурната идея.
                </p>
                <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                    <li>Екстериорни визуализации за сгради и комплекси</li>
                    <li>Интериорни 3D рендери на пространства</li>
                    <li>Виртуални разходки и 360-градусови панорами</li>
                    <li>Продуктови и детайлни студийни рендери</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
