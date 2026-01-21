import { create } from "zustand";

interface User {
  id: string;
  email: string;
}

interface WalletTwoStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useStoreWalletTwo = create<WalletTwoStore>((set) => ({
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),

  user: null,
  setUser: (user: User | null) => set({ user }),

  token: null,
  setToken: (token: string | null) => set({ token }),
}));
