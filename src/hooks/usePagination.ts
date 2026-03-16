import { useState, useCallback } from 'react';

interface UsePaginationOptions {
    initialPage?: number;
    initialLimit?: number;
}

export const usePagination = ({
    initialPage = 1,
    initialLimit = 10,
}: UsePaginationOptions = {}) => {
    const [page, setPage] = useState(initialPage);
    const [limit] = useState(initialLimit);

    const goToPage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const nextPage = useCallback(() => {
        setPage((p) => p + 1);
    }, []);

    const prevPage = useCallback(() => {
        setPage((p) => Math.max(1, p - 1));
    }, []);

    const resetPage = useCallback(() => {
        setPage(1);
    }, []);

    const totalPages = (total: number) => Math.ceil(total / limit);

    return { page, limit, goToPage, nextPage, prevPage, resetPage, totalPages };
};