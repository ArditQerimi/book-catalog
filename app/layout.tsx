import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GeometricOverlay from "./components/GeometricOverlay";
import { verifySession } from "../lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Nur Catalog | Islamic Digital Library",
    description: "Preserving the intellectual heritage of the Islamic world.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await verifySession();
    const isAuthenticated = !!user;

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen relative islamic-pattern text-gray-800 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
                    <GeometricOverlay />

                    <Navbar isAuthenticated={isAuthenticated} user={user} />

                    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 relative z-10 min-h-[60vh]">
                        {children}
                    </main>

                    <Footer />
                </div>
            </body>
        </html>
    );
}
