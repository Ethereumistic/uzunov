import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/consulting'

export const Route = createFileRoute('/services/consulting')({
    component: ServiceConsultingPage,
})

function ServiceConsultingPage() {
    return (
        <ServiceLayout
            title={<>Консултантски <em className="italic font-light">Услуги</em></>}
            subtitle="Цялостни консултантски услуги от идеята до въвеждането в експлоатация."
            heroImage={{
                id: 'consulting-1',
                srcS: `${baseUrl}/2_S.webp`,
                srcM: `${baseUrl}/2_M.webp`,
                srcL: `${baseUrl}/2_L.webp`,
                src: `${baseUrl}/2_L.webp`,
                alt: 'Консултантски Услуги'
            }}
            bentoImages={[
                `${baseUrl}/1_S.webp`,
                `${baseUrl}/6_S.webp`,
                `${baseUrl}/4_S.webp`,
                `${baseUrl}/3_S.webp`
            ]}
            ctaImage={`${baseUrl}/5_S.webp`}
        >
            <div className="prose prose-stone lg:prose-lg max-w-none">
                <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">Вашият доверен партньор</h2>
                <p className="text-black/70 mb-4 leading-relaxed">
                    Инвестиционният процес е сложен маратон, в който експертното мнение е безценно.
                    Предлагаме професионални консултации, за да ви помогнем във вземането на стратегически,
                    технически и финансови решения на всяка стъпка.
                </p>
                <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                    <li>Помощ при съгласуване на проекти и документация</li>
                    <li>Избор на подходящ терен и градоустройствени анализи</li>
                    <li>Оптимизиране на инвестиционните разходи</li>
                    <li>Независим одит на вече съществуващи проекти</li>
                </ul>
            </div>
        </ServiceLayout>
    )
}
