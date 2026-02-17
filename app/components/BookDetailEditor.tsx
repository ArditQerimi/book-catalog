"use client";

import { useState, useTransition } from "react";
import { updateBookDetailsAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Pencil, Save, X, Loader2 } from "lucide-react";

interface BookDetailEditorProps {
    bookId: string;
    initialDescription: string;
    initialPrice: string;
    initialInStock: boolean;
}

export default function BookDetailEditor({
    bookId,
    initialDescription,
    initialPrice,
    initialInStock
}: BookDetailEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialDescription);
    const [price, setPrice] = useState(initialPrice);
    const [inStock, setInStock] = useState(initialInStock);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateBookDetailsAction(bookId, {
                description,
                price,
                inStock
            });

            if (result.success) {
                setMessage({ type: 'success', text: 'Updated successfully!' });
                setIsEditing(false);
                router.refresh();
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Update failed.' });
            }
        });
    };

    const handleCancel = () => {
        setDescription(initialDescription);
        setPrice(initialPrice);
        setInStock(initialInStock);
        setIsEditing(false);
        setMessage(null);
    };

    if (!isEditing) {
        return (
            <div className="mt-8">
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-full border border-emerald-100"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Details
                </button>
                {message && (
                    <p className={`mt-3 text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-900 flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Book Details
                </h4>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                        {isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        Save
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                {/* Description */}
                <div>
                    <label className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl py-3 px-4 text-sm font-medium text-emerald-900 placeholder:text-emerald-800/20 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all resize-none"
                    />
                </div>

                {/* Price & In Stock Row */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-2">
                            Price (GBP)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800/40 font-bold">£</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-emerald-50/30 border border-emerald-100/50 rounded-xl py-3 pl-8 pr-4 text-sm font-medium text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest mb-2">
                            Stock Status
                        </label>
                        <button
                            type="button"
                            onClick={() => setInStock(!inStock)}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border-2 ${inStock
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-red-50 border-red-200 text-red-600'
                                }`}
                        >
                            {inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>

            {message && (
                <p className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {message.text}
                </p>
            )}
        </div>
    );
}
