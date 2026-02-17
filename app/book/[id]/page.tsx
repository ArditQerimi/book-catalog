
import { getBooksAction } from "@/lib/actions";
import { ArrowLeft, Info, Scroll, Layers, Tag, Library, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Book } from '@/types';
import ThemePills from '@/app/components/ThemePills';
import IconWrapper from '@/app/components/IconWrapper';
import BookCard from '@/app/components/BookCard';
import Link from 'next/link';
import { notFound } from "next/navigation";

export const revalidate = 60;

interface BookPageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const books = await getBooksAction();
    return books.map((book) => ({
        id: book.id,
    }));
}

export default async function BookPage({ params }: BookPageProps) {
    const { id } = await params;
    const books = await getBooksAction();
    const book = books.find(b => b.id === id);

    if (!book) {
        notFound();
    }

    // Recommendation engine
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto px-6 py-12">

            {/* Main Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-16 mb-24">

                {/* Left Column: Cover Image (Floating Style) */}
                <div className="w-full lg:w-1/3 shrink-0">
                    <div className="sticky top-28 bg-white p-8 rounded shadow-sm border border-emerald-50 text-center max-w-xs mx-auto lg:max-w-none">
                        <div className="relative aspect-[2/3] w-full shadow-2xl rounded-none overflow-hidden">
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Title and Author under Image */}
                        <div className="mt-8 text-center text-left lg:text-center">
                            <h1 className="text-3xl font-bold text-emerald-950 italic mb-2 leading-tight">
                                {book.title}
                            </h1>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="text-lg text-emerald-700 font-medium font-serif italic">by {book.author}</span>
                                <div className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Metadata & Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    {/* Header: Book Description */}
                    <div className="mb-6 border-b border-emerald-100 pb-2">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-emerald-900 mb-2">Book Description</h3>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm mb-6">
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Publisher</span>
                            <span className="font-semibold text-emerald-900">{book.publisher}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Originally Published</span>
                            <span className="font-semibold text-emerald-900">{book.year} CE</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">ISBN Identifier</span>
                            <span className="font-mono text-emerald-700">{book.isbn}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Language</span>
                            <span className="font-semibold text-emerald-900 text-emerald-600">{book.language.split('/')[0]}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Pages</span>
                            <span className="font-semibold text-emerald-900">{book.pages}p</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Category</span>
                            <span className="font-semibold text-emerald-900">{book.category}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-1">Price</span>
                            <span className="font-semibold text-emerald-900 text-lg">€{Number(book.price).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6 text-emerald-900/80 leading-relaxed text-lg font-serif">
                        {book.description}
                    </div>

                    {/* Tags/Editions */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <ThemePills themes={book.themes} />
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/50 mb-3">Historical Context</h3>
                        <p className="text-emerald-900 italic font-serif">"{book.historicalContext}"</p>
                    </div>

                </div>
            </div>

            {/* Recommendation Section */}
            {recommendations.length > 0 && (
                <div className="border-t border-emerald-100/50 pt-20">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-bold text-emerald-900 italic">Related Manuscripts</h3>
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800">View All</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
