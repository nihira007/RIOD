import { useState } from "react";
import { Link} from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "../common/Button";
import { cn } from "@/lib/utils";


export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
                <Link to="/" className="flex items-center gap-2">
                    <Logo />
                </Link>

                

                <div className="hidden items-center gap-3 md:flex">
                    <Link to="/analyze">
                        <Button size="sm">Analyze an idea</Button>
                    </Link>
                </div>

                <button
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={16} /> : <Menu size={16} />}
                </button>
            </div>

            <div
                className={cn(
                    "grid overflow-hidden border-t border-border/70 transition-all duration-300 md:hidden",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="min-h-0">
                    
                </div>
            </div>
        </header>
    );
}
