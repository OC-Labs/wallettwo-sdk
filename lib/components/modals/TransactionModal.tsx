import Modal from "./Modal";
import TransactionAction from "../actions/TransactionAction";
import useModal from "../../hooks/useModal";

export default function TransactionModal() {
  const { modal, close } = useModal("transaction-modal");
  const props = modal?.props || {};

  return (<Modal name="transaction-modal" className={(props.className as string) || ""}>
    <TransactionAction
      network={props.network as string}
      transactions={props.transactions as { method: string; address: string; params: unknown[]; abi?: unknown }[]}
      onSuccess={(tx) => {
        close();
        if (props.onSuccess) (props.onSuccess as (tx: string) => void)(tx);
      }}
      onFailure={(error) => {
        close();
        if (props.onFailure) (props.onFailure as (error: string) => void)(error);
      }}
      onCancel={() => {
        close();
        if (props.onCancel) (props.onCancel as () => void)();
      }}
      onExecuting={() => {
        if (props.onExecuting) (props.onExecuting as () => void)();
      }}
    />
  </Modal>);
}
