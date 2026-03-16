import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onGoTo: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPrev, onNext, onGoTo }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePages = pages.filter(
        (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
    );

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onClick={onPrev}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={16} />
            </button>

            {visiblePages.map((p, i) => {
                const prev = visiblePages[i - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                    <div key={p} className="flex items-center gap-1">
                        {showEllipsis && (
                            <span className="text-slate-600 font-mono text-xs px-1">…</span>
                        )}
                        <button
                            onClick={() => onGoTo(p)}
                            className={clsx(
                                'w-8 h-8 rounded-lg font-mono text-xs transition-colors',
                                p === page
                                    ? 'bg-amber-400 text-slate-950 font-bold'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                            )}
                        >
                            {p}
                        </button>
                    </div>
                );
            })}

            <button
                onClick={onNext}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;