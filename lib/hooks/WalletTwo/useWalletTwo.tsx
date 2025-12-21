import { useContext } from "react";
import { WalletTwoContext } from "./WalletTwoContext";
import WalletTwoAPI from "../../api/Wallettwo";

export default function useWalletTwo() {
  const context = useContext(WalletTwoContext);
  if(!context) throw new Error("useWalletTwo must be used within a WalletTwoProvider");

  const exchangeConsentToken = async (code: string) => {
    const { access_token } = await WalletTwoAPI.exchangeConsentToken(code);
    return access_token;
  }

  const logout = async () => {
    // eopen iframe for logout
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/action/logout?iframe=true`;
    iframe.id = "wallettwo-headless-login-iframe"
    document.body.appendChild(iframe);

    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://wallet.wallettwo.com") return;
        if (event.data.event === "wallet_logout") {
          localStorage.removeItem("wallettwo_token");
          context.setUser(null);
          context.setToken(null);
          
          window.removeEventListener("message", handleMessage);
          document.body.removeChild(iframe);
          clearTimeout(timeoutId);
          resolve(event.data);
        }
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        document.body.removeChild(iframe);
        reject(new Error("Logout timed out"));
      }, 10000); // 10 seconds timeout

      window.addEventListener("message", handleMessage);
    });
  }

  const signMessage = async (message: string) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/action/signature?message=${encodeURIComponent(message)}`;
    iframe.id = "wallettwo-headless-sign-message-iframe"
    document.body.appendChild(iframe);
    
    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://wallet.wallettwo.com") return;
        if (event.data.event === "message_signed") {
          window.removeEventListener("message", handleMessage);
          document.body.removeChild(iframe);
          clearTimeout(timeoutId);
          resolve(event.data);
        }
      };

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        document.body.removeChild(iframe);
        reject(new Error("Message signing timed out"));
      }, 10000); // 10 seconds timeout

      window.addEventListener("message", handleMessage);
    });
  }


  const executeTransaction = async ({
    networkId,
    methods,
    params,
    addresses,
    optionalAbis,
    waitTx = true,
    onFinish = () => {},
    onCancel = () => {}
  }: {
    networkId: number;
    methods: string[];
    params: any[][];
    addresses: string[];
    redirectURI: string[];
    optionalAbis?: any[];
    waitTx?: boolean;
    onFinish?: () => void;
    onCancel?: () => void;
  }
) => {
    context.setIsTransactionModalOpen?.(true);
    const url = new URL("https://wallet.wallettwo.com/action/transaction");
    const parameters = {
      iframe: "true",
      network: networkId,
      methods: JSON.stringify(methods),
      params: JSON.stringify(params),
      addresses: JSON.stringify(addresses),
      wait_tx: waitTx ? "true" : "false",
      abis: optionalAbis ? JSON.stringify(optionalAbis) : undefined
    }
    parameters && Object.entries(parameters).forEach(([key, value]: [string, any]) => {
      url.searchParams.append(key, value);
    });

    const iframe = document.createElement("iframe");
    iframe.src = url.toString();
    iframe.id = "wallettwo-transaction-iframe"
    context.setTxIframe?.(iframe);
    context.setTxIframeOnFinish?.(() => onFinish);
    context.setTxIframeOnCancel?.(() => onCancel);
  }


  const handleWalletTwoRedirect = async (event: MessageEvent) => {
    if (event.origin !== "https://wallet.wallettwo.com") return;
    const { code, type } = event.data;
    if(type === 'loginLoaded') return setLoading(false);

    window.removeEventListener("message", handleWalletTwoRedirect);
    window.location.href = `https://wallet.wallettwo.com/auth/login?access_token=${code}`;
  }

  const redirectToWalletTwo = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=auth&iframe=true`;
    // Append an id to iframe to remove it later
    iframe.id = "wallettwo-headless-login-iframe";
    document.body.appendChild(iframe);

    window.addEventListener("message", handleWalletTwoRedirect);
  }

  return {
    ...context,
    exchangeConsentToken,
    logout,
    signMessage,
    executeTransaction,
    redirectToWalletTwo
  };
}