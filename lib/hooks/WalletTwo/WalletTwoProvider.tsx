import { useEffect, useState } from "react";
import { WalletTwoContext } from "./WalletTwoContext";
import WalletTwoAPI from "../../api/Wallettwo";
import TransactionModal from "./TransactionModal";

export default function WalletTwoProvider({ children, loader }: { children: React.ReactNode, loader?: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<null | { id: string; email: string }>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState<boolean>(false);
  const [txIframe, setTxIframe] = useState<HTMLIFrameElement | null>(null);
  const [txIframeOnFinish, setTxIframeOnFinish] = useState<() => void>(() => {});
  const [txIframeOnCancel, setTxIframeOnCancel] = useState<() => void>(() => {});

  const loadUserFromToken = async (accessToken: string) => {
    const fetchedUser = await WalletTwoAPI.userInfo(accessToken);
    if(!fetchedUser) return;
    setUser(fetchedUser);
  }

  const handleWalletTwoMessages = async (event: MessageEvent) => {
    if (event.origin !== "https://wallet.wallettwo.com") return;
    const { code, type } = event.data;

    if(type === 'loginLoaded') return setLoading(false);
    if(type === "pinRequested") return setLoading(false);

    try {
      const { access_token } = await WalletTwoAPI.exchangeConsentToken(code);
      setToken(access_token);
      await loadUserFromToken(access_token);
    } catch (error) {
      console.error("Error exchanging consent token:", error);
    }
    const iframe = document.getElementById("wallettwo-headless-login-iframe");
    if (iframe && iframe.parentNode) {
      document.body.removeChild(iframe);
      // remove event listener after user is loaded
      window.removeEventListener("message", handleWalletTwoMessages);
    }
    setLoading(false);
  }

  const headlessLogin = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=auth&iframe=true`;
    // Append an id to iframe to remove it later
    iframe.id = "wallettwo-headless-login-iframe";
    document.body.appendChild(iframe);

    window.addEventListener("message", handleWalletTwoMessages);
  }

  useEffect(() => {
    headlessLogin();
  }, []);
  
  return (
    <WalletTwoContext.Provider value={{
      loading, setLoading,
      user, setUser,
      token, setToken,
      loadUserFromToken,
      headlessLogin,
      handleWalletTwoMessages,
      isTransactionModalOpen, setIsTransactionModalOpen,
      txIframe, setTxIframe,
      txIframeOnFinish, setTxIframeOnFinish,
      txIframeOnCancel, setTxIframeOnCancel
    }}>
      <TransactionModal />
      {loading ? (loader ? loader : <div>Loading...</div>) : children}
    </WalletTwoContext.Provider>
  );
}