import { useEffect } from "react";
import { useStoreWalletTwo } from "../../store";
import WalletTwoAPI from "../../api/Wallettwo";

export default function AuthAction({ 
  onAuth
}: {
  onAuth?: (accessToken: string) => void 
}) {
  const { user, setToken } = useStoreWalletTwo();
    
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "session");
  url.searchParams.append("iframe", "true");
  
  const handler = async (event: MessageEvent) => {
    if (event.origin !== "https://wallet.wallettwo.com") return;
    
    const iframe = document.getElementById("wallettwo-auth-iframe") as HTMLIFrameElement;
    if (!iframe || event.source !== iframe.contentWindow) return;
    
    const { token, type } = event.data;

    if(type !== "wallet_session") return;

    try {
      const { session } = await WalletTwoAPI.exchangeConsentToken(token);
      setToken(session.token);
      if(onAuth) await onAuth(session.token);
    } catch (error) {
      console.error("Error exchanging consent token:", error);
    }

    window.removeEventListener("message", handler);
  }
  

  useEffect(() => {
    if (user) return;
    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    }

  }, [user]);

  if (user) return null;

  return <iframe
    src={url.toString()}
    id="wallettwo-auth-iframe"
    className="w-full min-h-[650px] border-0"
    title="WalletTwo Auth"
  />
}