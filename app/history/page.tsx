import { db } from "@/lib/db";
import { historyEvents } from "@/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    const events = await db.select().from(historyEvents).orderBy(asc(historyEvents.order));

    return (
        <div className="space-y-20 py-10 max-w-5xl mx-auto">
            <header className="text-center space-y-6">
                <span className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-sm">Chronicles of Enlightenment</span>
                <h1 className="text-5xl md:text-7xl font-serif text-emerald-900">
                    A Legacy Written in Gold
                </h1>
                <p className="text-xl text-emerald-700/70 max-w-3xl mx-auto font-light leading-relaxed">
                    Journey through the Golden Age of Islamic intellectual history, from the House of Wisdom to the grand libraries of Cordoba.
                </p>
            </header>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-100 via-emerald-400 to-emerald-100 hidden md:block opacity-50" />

                <div className="space-y-24">
                    {events.length === 0 ? (
                        <div className="text-center py-24 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-emerald-100 shadow-2xl shadow-emerald-900/5">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif text-emerald-900 mb-2">The Archive is Opening...</h2>
                            <p className="text-emerald-700/60 font-light">Ancient manuscripts are being cataloged into the timeline.</p>
                        </div>
                    ) : (
                        events.map((event, idx) => (
                            <div key={event.id} className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                <div className="flex-1 w-full">
                                    <div className="p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-500 group border border-emerald-50 hover:border-emerald-200">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="w-12 h-12 bg-emerald-950 text-emerald-50 rounded-2xl flex items-center justify-center font-serif text-xl">
                                                {idx + 1}
                                            </span>
                                            <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase">
                                                {event.period}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-serif text-emerald-900 mb-6 group-hover:text-emerald-700 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed font-light mb-8 italic">
                                            "{event.description}"
                                        </p>
                                        {event.image && (
                                            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-inner bg-emerald-50/50">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden md:flex w-16 h-16 bg-white border-4 border-emerald-100 rounded-full items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform">
                                    <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse" />
                                </div>
                                <div className="flex-1 hidden md:block" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
