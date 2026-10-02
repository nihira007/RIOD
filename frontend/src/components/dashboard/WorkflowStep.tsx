interface Props {
    index: number;
    title: string;
    description: string;
}

export default function WorkflowStep({ index, title, description }: Props) {
    return (
        <div className="relative pl-14">
            <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-brand/40 bg-brand/10 font-mono text-sm font-semibold text-brand">
                {index}
            </span>
            <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
        </div>
    );
}
