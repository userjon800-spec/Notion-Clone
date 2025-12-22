import { create } from "zustand";
interface SearchStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}
export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  onToggle: () => set({ isOpen: !get().isOpen }),
}));
