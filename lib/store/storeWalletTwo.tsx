import { create } from "zustand";

export const useStoreWalletTwo = create((set) => ({
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),

  user: null,
  setUser: (user: null | { id: string; email: string }) => set({ user }),

  token: null,
  setToken: (token: string | null) => set({ token }),
}));
