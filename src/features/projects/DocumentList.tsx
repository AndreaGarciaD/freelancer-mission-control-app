import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    FileText, Video, Palette,
    File, ExternalLink, Pencil, Trash2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/format';
import type { DocumentType, ProjectDocument } from '../../types/documents.types';


const TYPE_CONFIG: Record<DocumentType, {
    icon: React.ElementType;
    label: string;
    colors: string;
    iconColor: string;
}> = {
    doc: {
        icon: FileText,
        label: 'Document',
        colors: 'bg-blue-500/10 border-blue-500/20',
        iconColor: 'text-blue-400',
    },
    meeting: {
        icon: Video,
        label: 'Meeting',
        colors: 'bg-purple-500/10 border-purple-500/20',
        iconColor: 'text-purple-400',
    },
    design: {
        icon: Palette,
        label: 'Design',
        colors: 'bg-pink-500/10 border-pink-500/20',
        iconColor: 'text-pink-400',
    },
    other: {
        icon: File,
        label: 'Other',
        colors: 'bg-slate-500/10 border-slate-500/20',
        iconColor: 'text-slate-400',
    },
};

interface DocumentListProps {
    documents: ProjectDocument[];
    onEdit: (doc: ProjectDocument) => void;
    onDelete: (id: number) => void;
    compact?: boolean;
}

const DocumentList = ({ documents, onEdit, onDelete, compact = false }: DocumentListProps) => {
    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <FileText size={20} className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-mono text-sm">No documents yet</p>
                <p className="text-slate-600 text-xs">Add links to docs, recordings or designs</p>
            </div>
        );
    }

    return (
        <div className={clsx('grid grid-cols-1 gap-3', !compact && 'sm:grid-cols-2')}>
            {documents.map((doc, i) => {
                const config = TYPE_CONFIG[doc.type];
                const Icon = config.icon;

                return (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.07 }}
                        className={clsx(
                            'flex items-start gap-3 p-4 rounded-xl border transition-colors group',
                            config.colors
                        )}
                    >
                        {/* Type icon */}
                        <div className="shrink-0 mt-0.5">
                            <Icon size={18} className={config.iconColor} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-100 text-sm font-medium truncate">
                                {doc.title}
                            </p>
                            <p className="font-mono text-xs text-slate-500 mt-0.5 truncate">
                                {config.label} · {formatDate(doc.created_at)}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-colors"
                                title="Open link"
                            >
                                <ExternalLink size={13} />
                            </a>
                            <Button variant="ghost" size="sm" onClick={() => onEdit(doc)}>
                                <Pencil size={13} />
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => onDelete(doc.id)}>
                                <Trash2 size={13} />
                            </Button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DocumentList;