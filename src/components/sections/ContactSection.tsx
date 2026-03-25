import * as React from "react"
import { cn } from "#/lib/utils"
import { ArrowRight, Mail, MapPin } from "lucide-react"

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSuccess, setIsSuccess] = React.useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                setIsSuccess(true)
                e.currentTarget.reset()
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        } finally {
            setIsSubmitting(false)
            setTimeout(() => setIsSuccess(false), 5000)
        }
    }

    return (
        <section id="contact" className="w-full pt-24 scroll-mt-8 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="relative">
                    {/* <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-stone-200/20 rounded-full blur-[100px] -z-10" /> */}
                    {/* <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-stone-100/20 rounded-full blur-[100px] -z-10" /> */}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">

                        {/* ── Left: text content ──────────────────────────── */}
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-10 py-8">
                            <div className="space-y-6">
                                <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-ink max-w-[12ch]">
                                    Да{" "}
                                    <em className="italic font-light text-black/30">
                                        създадем
                                    </em>{" "}
                                    нещо значимо
                                </h2>
                                <p className="text-ink-soft text-lg leading-relaxed max-w-md font-light">
                                    От концепция до детайлна реализация, ние сме тук, за да
                                    превърнем вашите идеи в устойчива архитектура.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-center gap-5 group cursor-pointer transition-all">
                                    {/* Icon pill — matches hero ghost button surface */}
                                    <div className="flex items-center justify-center size-14 rounded-2xl bg-[#1a1916]/5 backdrop-blur-xl saturate-150 border border-[#1a1916]/10 shadow-[0_4px_16px_rgba(15,14,13,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] group-hover:scale-105 group-hover:border-[#1a1916]/20 transition-all duration-300">
                                        <Mail className="size-5 text-ink" />
                                    </div>
                                    <div>
                                        <p className="text-label text-[10px] mb-1 opacity-50 tracking-widest uppercase font-bold">
                                            Пишете ни
                                        </p>
                                        <a
                                            href="mailto:arh_uzunov@abv.bg"
                                            className="text-xl font-bold"
                                        >
                                            arh_uzunov@abv.bg
                                        </a>
                                    </div>
                                </div>

                                {/* Location */}
                                <a href="https://maps.app.goo.gl/1Ah9dCT6cMTaKKBL7" target="_blank" className="flex items-center gap-5 group cursor-pointer border-t border-stone-200 pt-6 transition-all">
                                    <div className="flex items-center justify-center size-14 rounded-2xl bg-[#1a1916]/5 backdrop-blur-xl saturate-150 border border-[#1a1916]/10 shadow-[0_4px_16px_rgba(15,14,13,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] group-hover:scale-105 group-hover:border-[#1a1916]/20 transition-all duration-300">
                                        <MapPin className="size-5 text-ink" />
                                    </div>
                                    <div>
                                        <p className="text-label text-[10px] mb-1 opacity-50 tracking-widest uppercase font-bold">
                                            Посетете ни
                                        </p>
                                        <p className="text-xl font-bold ">
                                            гр. Габрово, България
                                        </p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* ── Right: glass form card ───────────────────────── */}
                        <div className="lg:col-span-7">
                            {/*
                             * Outer card — same layering strategy as the hero slider card:
                             * dark image underneath, white/10 glass on top.
                             */}
                            <div className="relative h-full rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(15,14,13,0.22)]">

                                {/* Background image */}
                                <img
                                    src="https://cdn.jsdelivr.net/gh/Ethereumistic/uzunov-assets/projects/scentia/scientia-slide3.webp"
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Dark scrim so text stays legible */}
                                <div className="absolute inset-0 bg-[#1a1916]/52" />

                                {/* Top edge highlight — same as hero */}
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/40 to-transparent z-10" />

                                {/* Glass layer + border */}
                                <div className="absolute inset-0 bg-white/8 saturate-550 border border-white/20 rounded-3xl" />

                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="relative z-10 flex flex-col h-full p-8 md:p-12 space-y-7"
                                >
                                    <input
                                        type="hidden"
                                        name="access_key"
                                        value="da717557-08c3-42e1-97f3-dae9e7bdf51a"
                                    />
                                    <input
                                        type="checkbox"
                                        name="botcheck"
                                        className="hidden"
                                        style={{ display: "none" }}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <Field label="Вашето име" className="md:col-span-2">
                                            <Input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Име и фамилия"
                                            />
                                        </Field>
                                        <Field label="Имейл адрес">
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="example@mail.com"
                                            />
                                        </Field>
                                        <Field label="Телефон">
                                            <Input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                placeholder="+359 ..."
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Вашето съобщение" className="flex-1 flex flex-col">
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            placeholder="Опишете накратко вашия проект..."
                                            className={cn(inputCls, "resize-none py-5 flex-1 min-h-[120px]")}
                                        />
                                    </Field>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={cn(
                                                "inline-flex w-full items-center justify-center gap-2 font-bold text-base  uppercase no-underline px-8 py-[14px] rounded-full transition-all duration-200",
                                                isSuccess
                                                    ? // success — solid white (same as hero primary CTA)
                                                    "text-[#1a1916] bg-white/90 backdrop-blur-xl saturate-150 border border-white/60 shadow-[0_4px_16px_rgba(15,14,13,0.2),inset_0_1px_0_rgba(255,255,255,0.9)]"
                                                    : isSubmitting
                                                        ? // loading — ghost (same as hero secondary CTA)
                                                        "text-white bg-white/10 backdrop-blur-xl saturate-150 border border-white/30 shadow-[0_4px_16px_rgba(15,14,13,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] cursor-wait"
                                                        : // idle — solid white, hero primary CTA style
                                                        "text-[#1a1916] bg-white/90 backdrop-blur-xl saturate-150 border border-white/60 shadow-[0_4px_16px_rgba(15,14,13,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_28px_rgba(15,14,13,0.24),inset_0_1px_0_white] active:scale-[0.98]"
                                            )}
                                        >
                                            {isSubmitting ? (
                                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : isSuccess ? (
                                                "Изпратено ✓"
                                            ) : (
                                                <>
                                                    Изпрати запитване
                                                    <ArrowRight strokeWidth={1.5} size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

/* ── Shared input style — white/10 ghost, consistent with hero glass ── */
const inputCls =
    "w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 px-6 text-white placeholder:text-white/35 focus:bg-white/18 focus:border-white/40 outline-none transition-all font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={inputCls} />
}

function Field({
    label,
    children,
    className,
}: {
    label: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-[10px] pl-1 font-bold tracking-widest text-white/45 uppercase">
                {label}
            </label>
            {children}
        </div>
    )
}