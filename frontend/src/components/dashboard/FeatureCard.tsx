import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/common/Card";

interface Props {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: Props) {
    return (
        <Card className="group p-6 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/12 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <Icon size={18} />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        </Card>
    );
}
