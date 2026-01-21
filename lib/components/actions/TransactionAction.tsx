import { useEffect } from "react";
import useMessageHandler from "../../hooks/useMessageHandler";
import { useStoreWalletTwo } from "../../store";

export default function TransactionAction({
  onSuccess,
  onFailure,
  onCancel,
  onExecuting,
  network,
  methods,
  params,
  addresses,
  waitTx = true,
  abis
}: {
  onSuccess?: (transactionId: string) => void,
  onFailure?: (error: string) => void,
  onCancel?: () => void,
  onExecuting?: () => void,
  network?: string,
  methods?: string[],
  params?: any[],
  addresses?: string[],
  waitTx?: boolean,
  abis?: any[]
}) {
  const { defaultHandler } = useMessageHandler();
  const { user } = useStoreWalletTwo();
  
  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "transaction");
  url.searchParams.append("iframe", "true");
  url.searchParams.append("network", network || "137");
  url.searchParams.append("methods", JSON.stringify(methods || []));
  url.searchParams.append("params", JSON.stringify(params || []));
  url.searchParams.append("addresses", JSON.stringify(addresses || []));
  url.searchParams.append("waitTx", waitTx ? "true" : "false");
  url.searchParams.append("abis", JSON.stringify(abis || []));

  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    if (event.data.type === "transaction_complete") {
      // Additional handling for transaction complete can be added here
      const { tx } = event.data;
      if(onSuccess) await onSuccess(tx);
    }

    if (event.data.type === "transaction_cancelled") {
      // Additional handling for transaction cancelled can be added here
      if(onCancel) await onCancel();
    }

    if (event.data.type === "transaction_failed") {
      // Additional handling for transaction failed can be added here
      const { error } = event.data;
      if(onFailure) await onFailure(error);
    }

    if (event.data.type === "transactions_executing") {
      if(onExecuting) await onExecuting();
    }
  }

  useEffect(() => {
    if(!user) return;
    window.addEventListener("message", handler);

    
    return () => {
      window.removeEventListener("message", handler);
    }

  }, [user]);

  if(!user) return null;

  return <iframe
    src={url.toString()}
    id="wallettwo-transaction-iframe"
    className="w-full min-w-[600px] min-h-[650px] border-0"
    title="WalletTwo Transaction"
  />
}