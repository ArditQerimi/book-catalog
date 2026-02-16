
import React from 'react';
import { History as HistoryIcon } from 'lucide-react';

interface EmptyArchiveProps {
  onReset: () => void;
}

const EmptyArchive: React.FC<EmptyArchiveProps> = ({ onReset }) => {
  return (
    <div className="py-32 text-center bg-white/20 rounded-[40px] border-2 border-dashed border-emerald-100 animate-in fade-in duration-500">
       <HistoryIcon className="w-16 h-16 text-emerald-100 mx-auto mb-6" />
       <h4 className="text-3xl font-bold text-emerald-950 italic mb-2">No Records in Current View</h4>
       <p className="text-emerald-700/60 text-sm mb-8">The criteria you have selected yield no results from our vault.</p>
       <button onClick={onReset} className="px-8 py-3 bg-emerald-800 text-white font-bold rounded-2xl hover:bg-emerald-900 transition-all shadow-xl">
         RESTORE DEFAULT VIEW
       </button>
    </div>
  );
};

export default EmptyArchive;
