
'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Save, Upload, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { createBookAction, updateBookAction, deleteBookAction } from '../lib/actions';
import { useRouter } from 'next/navigation';

interface AdminPageClientProps {
  books: Book[];
}

const AdminPageClient: React.FC<AdminPageClientProps> = ({ books }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (editingBook) {
        await updateBookAction(editingBook.id, formData);
      } else {
        await createBookAction(formData);
      }
      setIsModalOpen(false);
      setEditingBook(null);
      router.refresh();
    } catch (error) {
      console.error("Operation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this manuscript from the archive?')) {
      await deleteBookAction(id);
      router.refresh();
    }
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold text-emerald-950 italic mb-2">Scribe Dashboard</h2>
          <p className="text-emerald-800/60 font-medium">Manage the digital archive and curate manuscripts.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          Enshrine New Manuscript
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="p-6 border-b border-emerald-100 bg-emerald-50/30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input 
              type="text"
              placeholder="Search archive..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50 text-emerald-900/40 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-4">Manuscript</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Year</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-14 bg-emerald-100 rounded overflow-hidden shadow-sm">
                        <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950">{book.title}</div>
                        <div className="text-sm text-emerald-600/60">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-emerald-600 font-mono text-sm">{book.year}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(book)} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/30 sticky top-0 backdrop-blur-md z-10">
              <h3 className="text-2xl font-bold text-emerald-950 italic">
                {editingBook ? 'Edit Manuscript' : 'Enshrine Manuscript'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-emerald-400 hover:bg-emerald-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Title</label>
                  <input name="title" defaultValue={editingBook?.title} required className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Author</label>
                  <input name="author" defaultValue={editingBook?.author} required className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Category</label>
                  <select name="category" defaultValue={editingBook?.category || 'Philosophy'} className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {['Philosophy', 'Science', 'Theology', 'Poetry', 'History', 'Medicine', 'Astronomy', 'Mathematics'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Year</label>
                  <input name="year" type="number" defaultValue={editingBook?.year} required className="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">Cover Image URL</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    <input name="coverImage" defaultValue={editingBook?.coverImage} placeholder="https://..." className="w-full pl-10 pr-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-100 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingBook ? 'Update Manuscript' : 'Enshrine Manuscript'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPageClient;
