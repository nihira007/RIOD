import type { ReactNode } from "react";
import { Container, Eyebrow } from "./Card";
import { cn } from "@/lib/utils";

interface Props {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    children: ReactNode;
    className?: string;
    id?: string;
}

export default function Section({
    eyebrow,
    title,
    subtitle,
    align = "center",
    children,
    className,
    id,
}: Props) {
    return (
        <section id={id} className={cn("py-20 sm:py-28", className)}>
            <Container>
                <div
                    className={cn(
                        "mb-14 max-w-2xl",
                        align === "center" ? "mx-auto text-center" : "text-left"
                    )}
                >
                    {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}

                    <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                        {title}
                    </h2>

                    {subtitle && <p className="mt-4 text-base leading-relaxed text-muted">{subtitle}</p>}
                </div>

                {children}
            </Container>
        </section>
    );
}
