import * as React from 'react';
import { Library } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-emerald-950 text-white pt-24 pb-12 px-6 relative mt-24">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <Library className="w-10 h-10 text-amber-500 mb-8" />
                <p className="text-[11px] tracking-[0.6em] uppercase text-emerald-200/30 font-bold italic text-center max-w-md">
                    Knowledge is a trust for the future. Preserved via AI & Secure Ledger logic.
                </p>
                <div className="mt-12 pt-8 border-t border-white/5 w-full text-center">
                    <p className="text-[10px] text-emerald-800 font-bold tracking-widest">© 1446 AH • NUR DIGITAL ARCHIVE</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
