import { useEffect } from "react";
import { useStoreWalletTwo } from "../../store";
import useMessageHandler from "../../hooks/useMessageHandler";

export default function SignatureAction({ 
  message = "", onSignature 
}: { 
  message: string, 
  onSignature?: (signature: string) => void 
}) {
  const { defaultHandler } = useMessageHandler();
  const { user, setToken, setUser } = useStoreWalletTwo();
    
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "signature");
  url.searchParams.append("message", message);
  url.searchParams.append("iframe", "true");
  
  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    
    const iframe = document.getElementById("wallettwo-signature-iframe") as HTMLIFrameElement;
    if (!iframe || event.source !== iframe.contentWindow) return;
    
    if(event.data.type !== "message_signed") return;

    const { signature } = event.data;

    if(onSignature) await onSignature(signature);

    window.removeEventListener("message", handler);
  }
  

  useEffect(() => {
    if (!user || !message || message == "") return;
    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    }

  }, [user]);

  if (!user || !message || message == "") return null;

  return <iframe
    src={url.toString()}
    id="wallettwo-signature-iframe"
    className="w-full min-h-[650px] border-0"
    title="WalletTwo Signature"
  />
}