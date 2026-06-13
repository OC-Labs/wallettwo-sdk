import { useEffect } from "react";
import { useStoreWalletTwo } from "../../store";
import useMessageHandler from "../../hooks/useMessageHandler";

export interface RampActionParams {
  contract?: string;
  amount?: string | number;
  paymentMethod?: string;
  currency?: string;
  operator?: string;
  chainId?: number;
  externalId?: string;
  redirectUrl?: string;
  additionalTransactions?: unknown[];
  useFiat?: boolean;
}

export default function RampAction({
  contract,
  amount,
  paymentMethod,
  currency,
  operator,
  chainId,
  externalId,
  redirectUrl,
  additionalTransactions,
  useFiat,
  onRampSuccess,
  onRampFailure,
  onRampCancel,
}: RampActionParams & {
  onRampSuccess?: (session: unknown) => void,
  onRampFailure?: (error: string) => void,
  onRampCancel?: () => void,
}) {
  const { defaultHandler } = useMessageHandler();
  const { user, companyId } = useStoreWalletTwo();

  const url = new URL(`https://wallet.wallettwo.com/auth/login`);
  url.searchParams.append("action", "ramp");
  url.searchParams.append("iframe", "true");
  if (companyId) url.searchParams.append("companyId", companyId);
  if (contract) url.searchParams.append("ctrt", contract);
  if (amount !== undefined && amount !== null) url.searchParams.append("amt", String(amount));
  if (paymentMethod) url.searchParams.append("pm", paymentMethod);
  if (currency) url.searchParams.append("cur", currency);
  if (operator) url.searchParams.append("op", operator);
  if (chainId !== undefined && chainId !== null) url.searchParams.append("ntwk", String(chainId));
  if (externalId) url.searchParams.append("ext_id", externalId);
  if (redirectUrl) url.searchParams.append("redirect_uri", redirectUrl);
  if (additionalTransactions && additionalTransactions.length > 0) {
    url.searchParams.append("additional_txns", JSON.stringify(additionalTransactions));
  }
  if (useFiat !== undefined) url.searchParams.append("use_fiat", String(useFiat));

  const handler = async (event: MessageEvent) => {
    await defaultHandler(event);

    if (event.data?.completed === true || event.data?.type === "ramp_complete") {
      const session = event.data.session;
      if (onRampSuccess) await onRampSuccess(session);
    }

    if (event.data?.type === "ramp_cancelled") {
      if (onRampCancel) await onRampCancel();
    }

    if (event.data?.type === "ramp_failed") {
      const { error } = event.data;
      if (onRampFailure) await onRampFailure(error);
    }
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
    className="w-full h-full min-h-[620px] border-0"
    title="WalletTwo Ramp"
  />
}
