"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const publicRoutes = ['/login', '/agent-portal'];
        if (!loading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-dark)]">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not loading and no user, the useEffect will trigger redirect, 
    // but we shouldn't render children unless it's a public route.
    const publicRoutes = ['/login', '/agent-portal'];
    if (!user && !publicRoutes.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
