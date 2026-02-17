
import { Scroll, Users, Globe, BookOpen } from 'lucide-react';

export const dynamic = 'force-static';

export default function AboutPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[48px] bg-emerald-900 text-emerald-50 p-12 md:p-24 mb-16 shadow-2xl">
                <div className="absolute inset-0 opacity-10 islamic-pattern" />
                <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-amber-400" />
                        <span className="text-amber-400 font-bold uppercase tracking-[0.2em] text-xs">Since 830 CE</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold italic mb-8 leading-tight">
                        Preserving the <span className="text-amber-400">Light</span> of Knowledge.
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-100/80 font-serif italic leading-relaxed">
                        "The Nur Catalog is a digital reimagining of the Grand Library of Baghdad, dedicated to preserving the intellectual heritage of the Golden Age."
                    </p>
                </div>
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="bg-white p-10 rounded-[40px] border border-emerald-100 shadow-sm">
                    <Scroll className="w-10 h-10 text-emerald-800 mb-6" />
                    <h3 className="text-2xl font-bold text-emerald-950 mb-4">Our Mission</h3>
                    <p className="text-emerald-800/70 leading-relaxed">
                        To digitize, categorize, and make accessible the vast ocean of knowledge produced during the Islamic Golden Age. From Medicine to Philosophy, Astronomy to Mathematics, we ensure these works are never lost to time again.
                    </p>
                </div>
                <div className="bg-emerald-50 p-10 rounded-[40px] border border-emerald-100">
                    <Globe className="w-10 h-10 text-emerald-600 mb-6" />
                    <h3 className="text-2xl font-bold text-emerald-950 mb-4">Global Access</h3>
                    <p className="text-emerald-800/70 leading-relaxed">
                        Knowledge belongs to humanity. The Nur Catalog is an open-access initiative, allowing scholars, students, and the curious from every corner of the globe to explore these ancient texts in a modern format.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="mb-24">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-bold text-emerald-950 italic">The Curators</h2>
                    <div className="hidden md:flex items-center gap-2 text-emerald-900/40 text-xs font-bold uppercase tracking-widest">
                        <Users className="w-4 h-4" />
                        Archival Staff
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Ardit Qerimi", role: "Head Archivist", bio: "Led the digital transformation of the catalog." },
                        { name: "Al-Khwarizmi AI", role: "Computational Scribe", bio: "Algorithmic sorting and classification of texts." },
                        { name: "The Community", role: "Guardians of Wisdom", bio: "Scholars worldwide contributing to the database." }
                    ].map((member, i) => (
                        <div key={i} className="group bg-white p-8 rounded-[32px] border border-emerald-100 hover:border-emerald-300 transition-colors">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl mb-6 overflow-hidden relative">
                                <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors" />
                                <Users className="w-8 h-8 text-emerald-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h4 className="text-xl font-bold text-emerald-950 mb-1">{member.name}</h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">{member.role}</p>
                            <p className="text-emerald-800/60 text-sm">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
