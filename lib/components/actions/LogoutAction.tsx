import { useEffect } from "react";
import { useStoreWalletTwo } from "../../store";
import useMessageHandler from "../../hooks/useMessageHandler";

export default function LogoutAction({ onLogout }: { onLogout?: () => void }) {
  const { defaultHandler } = useMessageHandler();
  const { user, setToken, setUser } = useStoreWalletTwo();
    
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "logout");
  url.searchParams.append("iframe", "true");
  
  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    
    const iframe = document.getElementById("wallettwo-auth-iframe") as HTMLIFrameElement;
    if (!iframe || event.source !== iframe.contentWindow) return;
    
    if(event.data.type !== "wallet_logout") return;

    if(onLogout) await onLogout();

    setToken(null);
    setUser(null);

    window.removeEventListener("message", handler);
  }
  

  useEffect(() => {
    if (!user) return;
    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    }

  }, [user]);

  if (!user) return null;

  return <iframe
    src={url.toString()}
    id="wallettwo-logout-iframe"
    className="w-full min-h-[650px] border-0"
    title="WalletTwo Logout"
  />
}