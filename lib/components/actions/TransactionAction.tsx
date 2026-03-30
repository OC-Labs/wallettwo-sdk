import { useEffect } from "react";
import useMessageHandler from "../../hooks/useMessageHandler";
import { useStoreWalletTwo } from "../../store";

interface Transaction {
  method: string;
  address: string;
  params: unknown[];
  abi?: unknown;
}

export default function TransactionAction({
  onSuccess,
  onFailure,
  onCancel,
  onExecuting,
  network,
  transactions = [],
}: {
  onSuccess?: (transactionId: string) => void,
  onFailure?: (error: string) => void,
  onCancel?: () => void,
  onExecuting?: () => void,
  network?: string,
  transactions?: Transaction[],
}) {
  const { defaultHandler } = useMessageHandler();
  const { user, companyId } = useStoreWalletTwo();

  const url = new URL(`https://wallet.wallettwo.com/auth/login`)
  url.searchParams.append("action", "transaction");
  url.searchParams.append("iframe", "true");
  url.searchParams.append("network", network || "137");
  url.searchParams.append("transactions", JSON.stringify(transactions));
  if (companyId) url.searchParams.append("companyId", companyId);

  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);
    if (event.data.type === "transaction_complete") {
      const { tx } = event.data;
      if(onSuccess) await onSuccess(tx);
    }

    if (event.data.type === "transaction_cancelled") {
      if(onCancel) await onCancel();
    }

    if (event.data.type === "transaction_failed") {
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
