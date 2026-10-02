import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FlaskConical, FileText, Settings, Menu, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Logo from "../components/layout/Logo";
import { cn } from "@/lib/utils";

const menu = [
    { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" },
    { icon: FlaskConical, title: "Analyze", path: "/analyze" },
    { icon: FileText, title: "Reports", path: "/reports" },
    { icon: Settings, title: "Settings", path: "/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 items-center justify-between border-b border-border px-5 md:hidden">
                    <Logo to="/" />
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </header>

                {open && (
                    <div className="border-b border-border bg-surface-elevated px-4 py-3 md:hidden">
                        <nav className="flex flex-col gap-1">
                            {menu.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium",
                                                isActive ? "bg-brand/12 text-brand" : "text-muted"
                                            )
                                        }
                                    >
                                        <Icon size={17} />
                                        {item.title}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8 sm:py-9">{children}</div>
                </main>
            </div>
        </div>
    );
}
