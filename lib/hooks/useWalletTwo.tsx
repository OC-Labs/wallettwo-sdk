import WalletTwoAPI from "../api/Wallettwo";
import { useStoreWalletTwo, useStoreModal } from "../store";
import useMessageHandler from "./useMessageHandler";

export default function useWalletTwo() {
  const { setUser, user, token, companyId } = useStoreWalletTwo();
  const messageHandlers = useMessageHandler();
  
  const headlessLogin = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=session&iframe=true${companyId ? `&companyId=${companyId}` : ''}`;
    iframe.id = `wallettwo-headless-login-iframe`;
    document.body.appendChild(iframe);

    window.addEventListener("message", messageHandlers.headlessLogin);
  }

  const loadUserFromToken = async (accessToken: string) => {
    const fetchedUser = await WalletTwoAPI.userInfo(accessToken);
    if(!fetchedUser) return;
    setUser(fetchedUser);
  }

  const signMessage = async (message: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=signature&message=${encodeURIComponent(message)}&iframe=true&auto_accept=true${companyId ? `&companyId=${companyId}` : ''}`;
    iframe.id = "wallettwo-headless-signature-iframe";
    document.body.appendChild(iframe);

    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://wallet.wallettwo.com") return;

        if (event.data.event === "message_signed") {
          window.removeEventListener("message", handleMessage);
          if (iframe.parentNode === document.body) document.body.removeChild(iframe);
          clearTimeout(timeoutId);
          resolve(event.data.signature);
        }
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        if (iframe.parentNode === document.body) {
          document.body.removeChild(iframe);
        }
        reject(new Error("Sign message timed out"));
      }, 30000);

      window.addEventListener("message", handleMessage);
    });
  }

  const openModal = useStoreModal((state) => state.openModal);

  const executeTransaction = (params: {
    network?: string,
    transactions: { method: string; address: string; params: unknown[]; abi?: unknown }[],
    onSuccess?: (tx: string) => void,
    onFailure?: (error: string) => void,
    onCancel?: () => void,
    onExecuting?: () => void,
  }, className?: string) => {
    openModal("transaction-modal", { ...params, className }  as Record<string, unknown>);
  }

  const openRamp = (params?: {
    contract?: string,
    amount?: string | number,
    paymentMethod?: string,
    currency?: string,
    operator?: string,
    chainId?: number,
    externalId?: string,
    redirectUrl?: string,
    additionalTransactions?: unknown[],
    useFiat?: boolean,
    onRampSuccess?: (session: unknown) => void,
    onRampFailure?: (error: string) => void,
    onRampCancel?: () => void,
  }, className?: string) => {
    openModal("ramp-modal", {
      ...params,
      className: className || "w-[calc(100vw-2rem)] max-w-[600px] sm:w-[600px] !p-0",
    } as Record<string, unknown>);
  }

  const logout = async () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/action/logout?iframe=true&auto_accept=true${companyId ? `&companyId=${companyId}` : ''}`;
    iframe.id = "wallettwo-headless-logout-iframe";
    document.body.appendChild(iframe);

    return messageHandlers.logout();
  }

  return {
    headlessLogin,
    loadUserFromToken,
    signMessage,
    executeTransaction,
    openRamp,
    logout,
    user,
    token
  };
}