import { getBooksAction } from "@/lib/actions";
import { ArrowLeft, Info, Scroll, Layers, Tag, Library, ChevronLeft } from 'lucide-react';
import { Book } from '@/types';
import BookHero from '@/app/components/BookHero';
import BookStats from '@/app/components/BookStats';
import ThemePills from '@/app/components/ThemePills';
import IconWrapper from '@/app/components/IconWrapper';
import BookCard from '@/app/components/BookCard';
import Link from 'next/link';
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface BookPageProps {
    params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
    const { id } = await params;
    const books = await getBooksAction();
    const book = books.find(b => b.id === id);

    if (!book) {
        notFound();
    }

    // Recommendation engine: category match > theme match > author match
    const recommendations = books
        .filter(b => b.id !== id)
        .map(b => {
            let score = 0;
            if (b.category === book.category) score += 5;
            if (b.author === book.author) score += 3;
            const sharedThemes = b.themes.filter(t => book.themes.includes(t));
            score += sharedThemes.length * 2;
            return { book: b, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.book);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-12">
                <Link href="/" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800/40 hover:text-emerald-800 transition-all">
                    <IconWrapper icon={ChevronLeft} size={16} className="transition-transform group-hover:-translate-x-1" />
                    BACK TO MANUSCRIPTS
                </Link>
            </div>

            <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-emerald-100/50 flex flex-col lg:flex-row min-h-[700px]">
                {/* Visual Cover Section */}
                <div className="w-full lg:w-2/5 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-100 bg-emerald-50 min-h-[400px]">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none islamic-pattern" />
                    <div className="absolute inset-4 border border-white/20 rounded-[32px] pointer-events-none" />
                </div>

                {/* Content Details */}
                <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col">
                    <BookHero book={book} />

                    <div className="space-y-12 flex-1">
                        <section className="relative">
                            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-amber-200 rounded-full opacity-40" />
                            <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-4">
                                <IconWrapper icon={Info} size={16} /> Archival Synopsis
                            </h3>
                            <p className="text-xl text-emerald-950 leading-relaxed italic font-serif opacity-90">"{book.description}"</p>
                        </section>

                        <section className="bg-emerald-900 text-emerald-50 p-8 md:p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 islamic-pattern" />
                            <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 relative z-10">
                                <IconWrapper icon={Scroll} size={16} /> Historical Significance
                            </h3>
                            <p className="text-base leading-relaxed opacity-90 font-light relative z-10">{book.historicalContext}</p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-5">
                                    <IconWrapper icon={Layers} size={16} /> Key Philosophical Themes
                                </h3>
                                <ThemePills themes={book.themes} />
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-5">
                                    <IconWrapper icon={Tag} size={16} /> Codicological Information
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Publisher', value: book.publisher },
                                        { label: 'ISBN Identifier', value: book.isbn, mono: true }
                                    ].map(item => (
                                        <div key={item.label} className="flex justify-between items-center text-xs pb-3 border-b border-emerald-50">
                                            <span className="text-emerald-800/40 font-bold uppercase text-[9px]">{item.label}</span>
                                            <span className={`text-emerald-950 font-bold italic ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="mt-auto pt-12 border-t border-emerald-50">
                            <BookStats year={book.year} pages={book.pages} language={book.language} price={book.price} />
                            <div className="flex justify-end mt-8">
                                <div className="bg-emerald-50/50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                                    <span className="text-3xl font-bold text-emerald-950 italic">£{Number(book.price).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation Section */}
            {recommendations.length > 0 && (
                <div className="mt-24 pt-20 border-t border-emerald-100/50">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <Library className="w-6 h-6 text-emerald-800" />
                        </div>
                        <h3 className="text-4xl font-bold text-emerald-900 italic text-center">Further Pathways of Knowledge</h3>
                        <p className="text-emerald-800/40 font-bold uppercase tracking-widest text-[10px] mt-2">Recommended scholarly works from the archive</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendations.map(rec => (
                            <BookCard
                                key={rec.id}
                                book={rec}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
