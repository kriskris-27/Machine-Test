import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin Dashboard | Cipher Schools",
    description: "Agent Management & Task Distribution System",
};

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} antialiased`}>
                <ToastProvider>
                    <AuthProvider>
                        <ProtectedRoute>
                            {children}
                        </ProtectedRoute>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
