import { create } from 'zustand';

interface UIStore {
  isBottomSheetOpen: boolean;
  isLoadingOverlay: boolean;
  overlayMessage: string;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  showOverlay: (message?: string) => void;
  hideOverlay: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isBottomSheetOpen: false,
  isLoadingOverlay: false,
  overlayMessage: 'Loading...',
  openBottomSheet: () => set({ isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false }),
  showOverlay: (message = 'Loading...') => set({ isLoadingOverlay: true, overlayMessage: message }),
  hideOverlay: () => set({ isLoadingOverlay: false }),
}));
