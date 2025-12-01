import { createContext } from 'react';

interface WalletTwoContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: null | { id: string; email: string };
  setUser: (user: null | { id: string; email: string }) => void;
  init: () => Promise<void>;
}

export const WalletTwoContext = createContext<WalletTwoContextType | undefined>(undefined);