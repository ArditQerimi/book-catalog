
import React, { useState } from 'react';
import { 
  Trash2, Edit3, Plus, Search, 
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { Book } from '../types';
import { deleteBookAction } from '../lib/actions';
import BookFormModal from '../components/BookFormModal';

interface AdminPageProps {
  books: Book[];
  onRefresh: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ books, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you certain you wish to purge this manuscript from the eternal archive?")) return;
    setIsDeleting(id);
    await deleteBookAction(id);
    onRefresh();
    setIsDeleting(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-emerald-950 italic">Archive Management</h2>
          <p className="text-emerald-700/60 text-sm mt-1">Manage the manuscripts available to seekers of knowledge.</p>
        </div>
        <button 
          onClick={() => { setEditingBook(null); setIsFormOpen(true); }}
          className="bg-emerald-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> NEW MANUSCRIPT
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-emerald-100 shadow-sm overflow-hidden">
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
                <th className="px-6 py-4">Status</th>
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
                      <p className="text-[10px] text-emerald-800/40 italic font-medium">{book.isbn}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingBook(book); setIsFormOpen(true); }} className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(book.id)} disabled={isDeleting === book.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
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
      </div>
      <BookFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={onRefresh} initialData={editingBook} />
    </div>
  );
};

export default AdminPage;
