import { useEffect } from "react";
import useMessageHandler from "../../hooks/useMessageHandler";

export default function TransactionAction() {
  const { defaultHandler } = useMessageHandler();
  
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "transaction");
  url.searchParams.append("iframe", "true");

  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    if (event.data.type === "transaction_complete") {
      // Additional handling for transaction complete can be added here
    }

    if (event.data.type === "transaction_cancelled") {
      // Additional handling for transaction cancelled can be added here
    }

    if (event.data.type === "transaction_failed") {
      // Additional handling for transaction failed can be added here
    }
  }

  useEffect(() => {
    window.addEventListener("message", handler);

    
    return () => {
      window.removeEventListener("message", handler);
    }

  }, [user]);

  return <iframe
    src={url.toString()}
    id="wallettwo-transaction-iframe"
    className="w-full min-w-[600px] min-h-[650px] border-0"
    title="WalletTwo Transaction"
  />
}