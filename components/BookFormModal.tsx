
import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Book as BookIcon, User, Calendar, Tag } from 'lucide-react';
import { createBookAction, updateBookAction } from '../lib/actions';
import { Book } from '../types';
import { CATEGORIES } from '../constants';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Book | null;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setPreview(initialData.coverImage);
    } else {
      setPreview(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (preview) formData.append('coverImage', preview);

    let result;
    if (initialData) {
      result = await updateBookAction(initialData.id, formData);
    } else {
      result = await createBookAction(formData);
    }
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#fcfbf4] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/3 bg-emerald-900 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 islamic-pattern" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-amber-400 italic mb-2">
              {initialData ? 'Edit Entry' : 'New Entry'}
            </h3>
            <p className="text-emerald-100/60 text-xs leading-relaxed">
              {initialData ? 'Update the ledger details for this manuscript.' : 'Add a new manuscript to the digital archive.'}
            </p>
          </div>
          
          <div className="relative z-10 mt-8 aspect-[2/3] bg-emerald-800/50 rounded-2xl border-2 border-dashed border-emerald-700 flex items-center justify-center overflow-hidden group">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="text-center p-4">
                <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Upload Cover</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <p className="text-white text-[10px] font-bold uppercase tracking-widest">Click to Change</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="flex-1 p-8 md:p-10">
          <div className="flex justify-end mb-6">
            <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-full transition-colors text-emerald-900">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Title</label>
              <div className="relative">
                <BookIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                <input name="title" required defaultValue={initialData?.title} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="The Book of Wisdom..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Author</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                <input name="author" required defaultValue={initialData?.author} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="Al-Ghazali..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Year (CE)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                  <input name="year" type="number" required defaultValue={initialData?.year} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="1100" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest ml-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200" />
                  <select name="category" defaultValue={initialData?.category || 'Philosophy'} className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 outline-none appearance-none">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-all shadow-xl disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {initialData ? 'UPDATE ARCHIVE' : 'ENSHRINE IN ARCHIVE'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
