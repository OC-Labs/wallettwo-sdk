import Modal from "./Modal";
import TransactionAction from "../actions/TransactionAction";
import useModal from "../../hooks/useModal";

export default function TransactionModal() {
  const { modal, close } = useModal("transaction-modal");
  const props = modal?.props || {};

  return (<Modal name="transaction-modal" className="">
    <TransactionAction
      network={props.network as string}
      methods={props.methods as string[]}
      params={props.params as any[]}
      addresses={props.addresses as string[]}
      abis={props.abis as any[]}
      waitTx={props.waitTx as boolean}
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
