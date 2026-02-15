
import React from 'react';
import { Sparkles, Globe, ExternalLink } from 'lucide-react';
import { GroundingSource } from '../types';

interface LibrarianInsightProps {
  explanation: string;
  sources: GroundingSource[];
}

const LibrarianInsight: React.FC<LibrarianInsightProps> = ({ explanation, sources }) => {
  return (
    <div className="mb-10 p-8 bg-white border border-emerald-100 rounded-[40px] shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <Sparkles className="w-full h-full text-emerald-900" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-amber-600" />
        </div>
        <span className="font-bold text-emerald-900 uppercase tracking-[0.3em] text-[10px]">Librarian's Insight</span>
      </div>
      <p className="text-base text-emerald-950 leading-relaxed italic font-serif">
        "{explanation}"
      </p>
      
      {sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-emerald-50">
          <p className="text-[9px] uppercase font-bold text-emerald-600/60 tracking-widest mb-4 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Scholarly Web References
          </p>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100 text-[10px] font-bold text-emerald-800 hover:bg-white hover:border-emerald-300 transition-all shadow-sm group"
              >
                <span className="max-w-[180px] truncate">{source.title}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianInsight;
