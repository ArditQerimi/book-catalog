
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

export const dynamic = 'force-static';

export default function ContactPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center mb-16">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-emerald-800" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-emerald-950 italic mb-4">Contact the Archivists</h1>
                <p className="text-emerald-800/60 max-w-2xl mx-auto font-serif italic text-lg">
                    "The Ink of the scholar is more holy than the blood of the martyr."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {[
                    { icon: MapPin, title: "Archive Location", value: "Dār al-Hikmah (House of Wisdom)\nBaghdad, Abbasid Caliphate" },
                    { icon: Mail, title: "Electronic Mail", value: "librarian@nur-catalog.org" },
                    { icon: Phone, title: "Secure Line", value: "+964 (0) 123 456 789" },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-emerald-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                            <item.icon className="w-6 h-6 text-emerald-900" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-2">{item.title}</h3>
                        <p className="text-emerald-950 font-bold whitespace-pre-wrap">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-emerald-900 rounded-[48px] p-8 md:p-16 relative overflow-hidden shadow-2xl max-w-4xl mx-auto text-center">
                <div className="absolute inset-0 opacity-10 islamic-pattern" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-amber-400 italic mb-4">Submit a Manuscript?</h2>
                    <p className="text-emerald-100/80 mb-8 max-w-xl mx-auto">
                        Do you possess a rare text that belongs in the House of Wisdom? Our scribes are always seeking to expand the collection.
                    </p>
                    <button className="bg-white text-emerald-900 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-50 transition-colors">
                        Initiate Submission Protocol
                    </button>
                </div>
            </div>
        </div>
    );
}
