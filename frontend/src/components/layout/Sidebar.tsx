import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FlaskConical,
    FileText,
    Settings,
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const menu = [
    { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" },
    { icon: FlaskConical, title: "Analyze", path: "/analyze" },
    { icon: FileText, title: "Reports", path: "/reports" },
    { icon: Settings, title: "Settings", path: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-elevated md:flex">
            <div className="flex h-18 items-center px-6 py-3.5">
                <Logo to="/dashboard" />
            </div>

            <nav className="flex-1 space-y-1 px-3.5 py-2">
                {menu.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand/12 text-brand"
                                        : "text-muted hover:bg-surface hover:text-foreground"
                                )
                            }
                        >
                            <Icon size={17} strokeWidth={2} />
                            {item.title}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
