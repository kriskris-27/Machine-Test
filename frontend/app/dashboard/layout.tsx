"use client";

import { useAuth } from "@/context/AuthContext";
import { Users, Upload, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { name: "Agents", href: "/dashboard", icon: Users },
        { name: "Task Distribution", href: "/dashboard/distribute", icon: Upload },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background-dark)] flex">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-wide">Admin Dashboard</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 shadow-inner"
                                        : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[var(--color-primary)]" : ""}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="mb-4 px-2">
                        <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Logged in as</p>
                        <p className="font-medium text-white truncate text-sm">{user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-red-400/90 border border-red-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-all group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Abstract Background Effects for Main Area */}
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[var(--color-primary)] opacity-5 blur-[150px] pointer-events-none rounded-full" />

                {/* Mobile Header */}
                <header className="md:hidden glass-panel border-b border-white/10 p-4 flex justify-between items-center z-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center">
                            <LayoutDashboard className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-white">Admin Dashboard</span>
                    </div>
                    <button onClick={logout} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 z-10 relative">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
