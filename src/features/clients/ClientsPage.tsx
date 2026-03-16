import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Pencil, Users } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useMemo } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { SkeletonRow } from '../../components/ui/Skeleton';
import ClientForm from './ClientForm';
import type { ClientPayload } from '../../types/client.types';

const ClientsPage = () => {
    const {
        clients, total, isLoading, error,
        search, setSearch,
        pagination,
        isModalOpen, editingClient,
        openCreateModal, openEditModal, closeModal,
        handleCreate, handleUpdate, handleDelete,
    } = useClients();

    const totalPages = useMemo(
        () => pagination.totalPages(total),
        [total, pagination]
    );

    const onSubmit = async (payload: ClientPayload) => {
        if (editingClient) {
            await handleUpdate(editingClient.id, payload);
        } else {
            await handleCreate(payload);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="w-72">
                    <Input
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<Search size={15} />}
                    />
                </div>
                <Button onClick={openCreateModal}>
                    <Plus size={16} />
                    New client
                </Button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <p className="text-red-400 text-sm font-mono">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-6 py-3 border-b border-slate-800 bg-slate-950/50">
                    {['Name', 'Email', 'Company', 'Actions'].map((col) => (
                        <span key={col} className="font-mono text-xs text-slate-500 uppercase tracking-wider">
                            {col}
                        </span>
                    ))}
                </div>

                {/* Rows */}
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                            <Users size={20} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500 font-mono text-sm">No clients found</p>
                        {search && (
                            <p className="text-slate-600 text-xs">
                                Try adjusting your search
                            </p>
                        )}
                    </div>
                ) : (
                    clients.map((client, i) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors items-center group"
                        >
                            <span className="text-slate-100 text-sm font-medium truncate">
                                {client.name}
                            </span>
                            <span className="text-slate-400 text-sm truncate font-mono">
                                {client.email ?? '—'}
                            </span>
                            <span className="text-slate-400 text-sm truncate">
                                {client.company ?? '—'}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditModal(client)}
                                >
                                    <Pencil size={14} />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(client.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500">
                    {total} {total === 1 ? 'client' : 'clients'} total
                </p>
                <Pagination
                    page={pagination.page}
                    totalPages={totalPages}
                    onPrev={pagination.prevPage}
                    onNext={pagination.nextPage}
                    onGoTo={pagination.goToPage}
                />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingClient ? 'Edit client' : 'New client'}
            >
                <ClientForm
                    onSubmit={onSubmit}
                    defaultValues={editingClient}
                />
            </Modal>
        </div>
    );
};

export default ClientsPage;