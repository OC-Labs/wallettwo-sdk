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

  const logout = () => {
    // eopen iframe for logout
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=logout&iframe=true`;
    iframe.id = "wallettwo-headless-login-iframe"
    document.body.appendChild(iframe);

    // clear local storage and context
    localStorage.removeItem("wallettwo_token");
    context.setUser(null);
    context.setToken(null);
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  const signMessage = async (message: string) => {
    const iframe = document.createElement("iframe");
    //iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/action/signature?message=${encodeURIComponent(message)}`;
    iframe.id = "wallettwo-headless-sign-message-iframe"
    document.body.appendChild(iframe);
    
    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://wallet.wallettwo.com") return;
        if (event.data.event === "message_signed") {
          window.removeEventListener("message", handleMessage);
          document.body.removeChild(iframe);
          resolve(event.data);
        }
      };
      window.addEventListener("message", handleMessage);

      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        document.body.removeChild(iframe);
        reject(new Error("Message signing timed out"));
      }, 10000); // 10 seconds timeout
    });
    
  }

  return {
    ...context,
    exchangeConsentToken,
    logout,
    signMessage
  };
}