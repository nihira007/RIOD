import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="flex flex-col items-center text-center">
                    <Logo />

                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                        AI-powered research intelligence platform for evaluating,
                        refining, and discovering research ideas through
                        literature-grounded analysis.
                    </p>

                    <p className="mt-8 text-xs text-muted">
                        © {new Date().getFullYear()} RIOD — Research Intelligence &
                        Opportunity Discovery
                    </p>
                </div>
            </div>
        </footer>
    );
}