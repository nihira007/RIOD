import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "@/components/common/Button";
import Logo from "@/components/layout/Logo";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
            <Logo />
            <Compass size={30} className="text-brand" />
            <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Error 404</p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
                    This page isn't in the literature
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                    Nothing was retrieved at this address. It may have moved, or never existed.
                </p>
            </div>
            <div className="flex gap-3">
                <Link to="/">
                    <Button variant="secondary">Back to home</Button>
                </Link>
                <Link to="/analyze">
                    <Button>Analyze an idea</Button>
                </Link>
            </div>
        </div>
    );
}
