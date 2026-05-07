import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/interior'

export const Route = createFileRoute('/services/urban')({
  component: ServiceUrbanPage,
})

function ServiceUrbanPage() {
  return (
    <ServiceLayout 
        title={<>Градоустройство</>}
        subtitle="Създаваме устойчива градска среда, която балансира нуждите на хората, природата и икономиката."
        heroImage={{
            id: 'urban-1',
            srcS: `${baseUrl}/1_S.webp`,
            srcM: `${baseUrl}/1_M.webp`,
            srcL: `${baseUrl}/1_L.webp`,
            src: `${baseUrl}/1_L.webp`,
            alt: 'Градоустройство'
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
            <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">От генерален план до реализация</h2>
            <p className="text-black/70 mb-4 leading-relaxed">
                Градоустройството е основата на устойчивото развитие на всяка общност. Ние създаваме комплексни 
                градоустройствени решения, които осигуряват хармонично развитие на урбанизираните територии 
                и подобряват качеството на живот.
            </p>
            <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                <li>Детайлни устройствени планове (ПУП) за жилни, смесени и обществени зони</li>
                <li>Градоустройствено планиране и визи за застрояване</li>
                <li>Инфраструктурно проектиране и паркоустройство</li>
                <li>Координация с общински и регионални институции</li>
            </ul>
        </div>
    </ServiceLayout>
  )
}