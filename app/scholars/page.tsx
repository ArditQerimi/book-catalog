import { db } from "@/lib/db";
import { scholars } from "@/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ScholarsPage() {
    const allScholars = await db.select().from(scholars).orderBy(desc(scholars.createdAt));

    return (
        <div className="space-y-16 py-10">
            <header className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-serif text-emerald-900 drop-shadow-sm">
                    Distinguished Scholars
                </h1>
                <p className="text-lg text-emerald-700/80 max-w-2xl mx-auto font-light italic">
                    "The ink of the scholar is more holy than the blood of the martyr."
                </p>
                <div className="h-1 w-24 bg-emerald-600 mx-auto rounded-full mt-8 opacity-40" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {allScholars.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white/30 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-inner">
                        <p className="text-emerald-800/60 text-xl font-light">The registry of sages is currently being compiled...</p>
                    </div>
                ) : (
                    allScholars.map((scholar) => (
                        <div key={scholar.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 border border-emerald-50">
                            <div className="h-72 relative overflow-hidden bg-emerald-100 flex items-center justify-center">
                                {scholar.image ? (
                                    <Image
                                        src={scholar.image}
                                        alt={scholar.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center">
                                        <span className="text-4xl font-serif text-emerald-100/30 select-none">
                                            {scholar.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="px-3 py-1 bg-emerald-100/20 backdrop-blur-md text-emerald-50 rounded-full text-xs font-medium uppercase tracking-wider border border-white/20">
                                        {scholar.period}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-serif text-emerald-900 group-hover:text-emerald-700 transition-colors">
                                        {scholar.name}
                                    </h3>
                                    <p className="text-emerald-600 font-medium text-sm italic">
                                        {scholar.title}
                                    </p>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-light">
                                    {scholar.bio}
                                </p>
                                <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
                                    <span className="text-xs text-emerald-800/50 font-bold uppercase tracking-widest">
                                        {scholar.specialization}
                                    </span>
                                    <button className="text-emerald-700 text-sm font-semibold hover:text-emerald-900 transition-colors flex items-center gap-2">
                                        View Works
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
