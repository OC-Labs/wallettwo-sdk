import { create } from "zustand";

interface Modal {
  id: string;
  isOpen: boolean;
  props?: Record<string, unknown>;
}

interface ModalState {
  modals: Record<string, Modal>;
  openModal: (id: string, props?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  getModal: (id: string) => Modal | undefined;
}

export const useStoreModal = create<ModalState>((set, get) => ({
  modals: {},

  openModal: (id: string, props = {}) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { id, isOpen: true, props },
      },
    })),

  closeModal: (id: string) =>
    set((state) => {
      const modal = state.modals[id];
      if (!modal) return {};
      return {
        modals: {
          ...state.modals,
          [id]: { ...modal, isOpen: false },
        },
      };
    }),

  toggleModal: (id: string) =>
    set((state) => {
      const modal = state.modals[id];
      if (!modal) return {};
      return {
        modals: {
          ...state.modals,
          [id]: { ...modal, isOpen: !modal.isOpen },
        },
      };
    }),

  getModal: (id: string) => get().modals[id],
}));
