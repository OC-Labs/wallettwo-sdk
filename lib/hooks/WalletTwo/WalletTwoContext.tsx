import { createContext } from 'react';

interface WalletTwoContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: null | { id: string; email: string };
  setUser: (user: null | { id: string; email: string }) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  loadUserFromToken: (accessToken: string) => Promise<void>;
  headlessLogin: () => void;
  handleWalletTwoMessages: (event: MessageEvent) => void;
  isTransactionModalOpen?: boolean;
  setIsTransactionModalOpen?: (isOpen: boolean) => void;
  txIframe?: HTMLIFrameElement | null;
  setTxIframe?: (iframe: HTMLIFrameElement | null) => void;
}

export const WalletTwoContext = createContext<WalletTwoContextType | undefined>(undefined);