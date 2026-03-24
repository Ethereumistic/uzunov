import { cn } from "../../lib/utils"

interface LogoProps {
    type?: "logomark" | "horizontal" | "logotype"
    className?: string
    variant?: "default" | "inverse" | "black"
    size?: "sm" | "md" | "lg"
}

export function Logo({
    type = "horizontal",
    className,
    variant = "default",
    size = "md",
}: LogoProps) {
    const isInverse = variant === "inverse"
    const isBlack = variant === "black"

    const sizeClasses = {
        sm: {
            mark: "w-8 h-8",
            top: "text-[0.7rem]",
            gap: "gap-2",
        },
        md: {
            mark: "w-10 h-10",
            top: "text-[0.85rem]",
            gap: "gap-3",
        },
        lg: {
            mark: "w-12 h-12",
            top: "text-xl",
            gap: "gap-4",
        },
    }

    const { mark, gap, top } = sizeClasses[size]

    const Logomark = (
        <img
            src="/uzunov-logo.webp"
            alt="Узунов Проект Лого"
            width={512}
            height={512}
            className={cn(
                mark,
                "object-contain transition-all duration-300",
                isBlack && "brightness-0"
            )}
        />
    )

    const Logotype = (
        <div className={cn(
            "flex justify-center mt-2 select-none font-bold uppercase leading-[1.1] tracking-tight",
            top,
            isBlack ? "text-black font-black" : (isInverse ? "text-white" : "text-black")
        )}>
            Узунов Проект
        </div>
    )

    if (type === "logomark") {
        return <div className={cn("inline-flex", className)}>{Logomark}</div>
    }

    if (type === "logotype") {
        return <div className={cn("inline-flex", className)}>{Logotype}</div>
    }

    return (
        <div className={cn("inline-flex items-center", gap, className)}>
            {Logomark}
            {Logotype}
        </div>
    )
}
