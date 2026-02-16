"use client";

import React, { useState } from 'react';
import {
    Trash2, Edit3, Plus, Search,
    CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { Book } from '@/types';
import {
    createCategoryAction,
    createAuthorInfoAction,
    createLanguageAction,
    deleteBookAction,
    deleteCategoryAction,
    deleteAuthorInfoAction,
    deleteLanguageAction
} from '@/lib/actions';
import BookFormModal from './BookFormModal';
import { useRouter } from 'next/navigation';
import { Category, AuthorInfo, Language } from '@/schema';

interface AdminContainerProps {
    initialBooks: Book[];
    initialCategories: Category[];
    initialAuthors: AuthorInfo[];
    initialLanguages: Language[];
}

type AdminTab = 'manuscripts' | 'categories' | 'authors' | 'languages';

const AdminContainer: React.FC<AdminContainerProps> = ({
    initialBooks,
    initialCategories,
    initialAuthors,
    initialLanguages
}) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('manuscripts');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const filteredBooks = initialBooks.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteBook = async (id: string) => {
        if (!window.confirm("Are you certain you wish to purge this manuscript from the eternal archive?")) return;
        setIsDeleting(id);
        await deleteBookAction(id);
        router.refresh();
        setIsDeleting(null);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Delete this category?")) return;
        await deleteCategoryAction(id);
        router.refresh();
    };

    const handleDeleteAuthor = async (id: string) => {
        if (!window.confirm("Delete this author?")) return;
        await deleteAuthorInfoAction(id);
        router.refresh();
    };

    const handleDeleteLanguage = async (id: string) => {
        if (!window.confirm("Delete this language?")) return;
        await deleteLanguageAction(id);
        router.refresh();
    };

    const handleRefresh = () => {
        router.refresh();
    };

    const TabButton = ({ id, label }: { id: AdminTab, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === id
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-emerald-950 italic">Archive Management</h2>
                    <p className="text-emerald-700/60 text-sm mt-1">Manage the manuscripts and metadata available to seekers of knowledge.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setEditingBook(null); setIsFormOpen(true); }}
                        className="bg-emerald-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all shadow-lg text-sm"
                    >
                        <Plus className="w-5 h-5" /> NEW ENTRY
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-6 flex-wrap">
                <TabButton id="manuscripts" label="Manuscripts" />
                <TabButton id="categories" label="Categories" />
                <TabButton id="authors" label="Authors" />
                <TabButton id="languages" label="Languages" />
            </div>

            <div className="bg-white rounded-[32px] border border-emerald-100 shadow-sm overflow-hidden min-h-[400px]">
                {activeTab === 'manuscripts' && (
                    <>
                        <div className="p-6 border-b border-emerald-50 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
                                <input
                                    type="text"
                                    placeholder="Search by title or author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl py-2 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-emerald-50/50 text-emerald-900/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-4">Manuscript</th>
                                        <th className="px-6 py-4">Details</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-50">
                                    {filteredBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-emerald-50/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-16 rounded-lg bg-emerald-100 overflow-hidden shrink-0 border border-emerald-200">
                                                        <img src={book.coverImage} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-950 italic line-clamp-1">{book.title}</p>
                                                        <p className="text-xs text-emerald-700/60 font-medium">by {book.author}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">{book.category}</span>
                                                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded uppercase">{book.year} CE</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => { setEditingBook(book); setIsFormOpen(true); }} className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteBook(book.id)} disabled={isDeleting === book.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                                                        {isDeleting === book.id ? <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredBooks.length === 0 && (
                                <div className="py-20 text-center">
                                    <AlertCircle className="w-8 h-8 text-emerald-100 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-emerald-900/40 italic">No matching manuscripts found in the ledger.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'categories' && (
                    <div className="p-8">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const formData = new FormData(form);
                            await createCategoryAction(formData);
                            form.reset();
                            router.refresh();
                        }} className="mb-10 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Category Name</label>
                                <input name="name" required className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Philosophy..." />
                            </div>
                            <div className="flex-[2] space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Description</label>
                                <input name="description" className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Brief description of the field..." />
                            </div>
                            <button type="submit" className="bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-emerald-900 transition-all">Add Category</button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {initialCategories.map(cat => (
                                <div key={cat.id} className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100 relative group">
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <h4 className="text-lg font-bold text-emerald-900 mb-2">{cat.name}</h4>
                                    <p className="text-xs text-emerald-700/60 line-clamp-2">{cat.description || 'No description provided.'}</p>
                                </div>
                            ))}
                        </div>
                        {initialCategories.length === 0 && <p className="text-center py-20 text-emerald-900/40 font-bold italic">No categories preserved.</p>}
                    </div>
                )}

                {activeTab === 'authors' && (
                    <div className="p-8">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const formData = new FormData(form);
                            await createAuthorInfoAction(formData);
                            form.reset();
                            router.refresh();
                        }} className="mb-10 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Author Name</label>
                                <input name="name" required className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Al-Farabi..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Death Year (CE)</label>
                                <input name="deathYear" type="number" className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="950" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Image URL</label>
                                <input name="image" className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="https://..." />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Short Bio</label>
                                <input name="bio" className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Polymath and philosopher..." />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-emerald-900 transition-all">Add Author</button>
                            </div>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {initialAuthors.map(author => (
                                <div key={author.id} className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100 relative group flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-200 overflow-hidden shrink-0">
                                        {author.image && <img src={author.image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-emerald-900">{author.name}</h4>
                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2">{author.deathYear ? `Died ${author.deathYear} CE` : 'Death date unknown'}</p>
                                        <p className="text-xs text-emerald-700/60 line-clamp-2">{author.bio || 'No bio recorded.'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAuthor(author.id)}
                                        className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {initialAuthors.length === 0 && <p className="text-center py-20 text-emerald-900/40 font-bold italic">No authors archived.</p>}
                    </div>
                )}

                {activeTab === 'languages' && (
                    <div className="p-8">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const formData = new FormData(form);
                            await createLanguageAction(formData);
                            form.reset();
                            router.refresh();
                        }} className="mb-10 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Language Name</label>
                                <input name="name" required className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="Arabic..." />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">ISO Code</label>
                                <input name="code" className="w-full bg-white border border-emerald-100 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-emerald-100" placeholder="ar" />
                            </div>
                            <button type="submit" className="bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-emerald-900 transition-all">Add Language</button>
                        </form>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {initialLanguages.map(lang => (
                                <div key={lang.id} className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">{lang.name}</p>
                                        <p className="text-[10px] text-emerald-400 uppercase font-black">{lang.code}</p>
                                    </div>
                                    <button onClick={() => handleDeleteLanguage(lang.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <BookFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleRefresh}
                initialData={editingBook}
                availableCategories={initialCategories}
                availableAuthors={initialAuthors}
                availableLanguages={initialLanguages}
            />
        </div>
    );
};

export default AdminContainer;
