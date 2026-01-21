import { useEffect } from "react";
import { useStoreWalletTwo } from "../../store";
import useMessageHandler from "../../hooks/useMessageHandler";

export default function RampAction({ onRampSuccess , onRampFailure, onRampCancel}: { onRampSuccess?: (transactionId: string) => void, onRampFailure?: (error: string) => void, onRampCancel?: () => void }) {
  const { defaultHandler } = useMessageHandler();
  const { user } = useStoreWalletTwo();
    
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "ramp");
  url.searchParams.append("iframe", "true");
  
  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    
    const iframe = document.getElementById("wallettwo-ramp-iframe") as HTMLIFrameElement;
    if (!iframe || event.source !== iframe.contentWindow) return;
    
    if (event.data.type === "ramp_complete") {
      const { transactionId } = event.data;
      if(onRampSuccess) await onRampSuccess(transactionId);
    }

    if (event.data.type === "ramp_cancelled") {
      if(onRampCancel) await onRampCancel();
    }

    if (event.data.type === "ramp_failed") {
      const { error } = event.data;
      if(onRampFailure) await onRampFailure(error);
    }

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
    id="wallettwo-ramp-iframe"
    className="w-full min-h-[650px] border-0"
    title="WalletTwo Ramp"
  />
}