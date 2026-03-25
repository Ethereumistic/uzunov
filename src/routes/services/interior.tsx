import { createFileRoute } from '@tanstack/react-router'
import { ServiceLayout } from '#/components/services/ServiceLayout'

const baseUrl = 'https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/services/interior'

export const Route = createFileRoute('/services/interior')({
  component: ServiceInteriorPage,
})

function ServiceInteriorPage() {
  return (
    <ServiceLayout 
        title={<>Интериорен <em className="italic font-light">Дизайн</em></>}
        subtitle="Създаваме пространства, които вдъхновяват и подобряват качеството на живот."
        heroImage={{
            id: 'interior-1',
            srcS: `${baseUrl}/1_S.webp`,
            srcM: `${baseUrl}/1_M.webp`,
            srcL: `${baseUrl}/1_L.webp`,
            src: `${baseUrl}/1_L.webp`,
            alt: 'Интериорен Дизайн'
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
            <h2 className="text-3xl font-display font-semibold mb-6 text-[#1a1916]">Вашият стил, нашата прецизност</h2>
            <p className="text-black/70 mb-4 leading-relaxed">
                Интериорът е сърцето на всяка сграда. Ние създаваме хармонични, функционални и естетически 
                издържани интериорни пространства, които отразяват индивидуалността на клиента и 
                оптимизират всяко кътче.
            </p>
            <ul className="list-disc pl-5 text-black/70 space-y-2 mb-8 marker:text-black/40">
                <li>Интериорни проекти за жилищни сгради и апартаменти</li>
                <li>Дизайн на обществени пространства, офиси и хотели</li>
                <li>Авторски надзор и проследяване на реализацията</li>
                <li>Подбор на материали, мебели и осветление</li>
            </ul>
        </div>
    </ServiceLayout>
  )
}
