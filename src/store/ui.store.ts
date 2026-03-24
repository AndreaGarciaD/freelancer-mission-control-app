import { create } from 'zustand';

interface UIState {
    isMobileNavOpen: boolean;
    openMobileNav: () => void;
    closeMobileNav: () => void;
    toggleMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isMobileNavOpen: false,
    openMobileNav: () => set({ isMobileNavOpen: true }),
    closeMobileNav: () => set({ isMobileNavOpen: false }),
    toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}));