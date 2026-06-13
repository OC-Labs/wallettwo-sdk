import Modal from "./Modal";
import RampAction from "../actions/RampAction";
import useModal from "../../hooks/useModal";

export default function RampModal() {
  const { modal, close } = useModal("ramp-modal");
  const props = modal?.props || {};

  return (<Modal name="ramp-modal" className={(props.className as string) || ""}>
    <RampAction
      key={modal?.instanceId}
      contract={props.contract as string}
      amount={props.amount as string | number}
      paymentMethod={props.paymentMethod as string}
      currency={props.currency as string}
      operator={props.operator as string}
      chainId={props.chainId as number}
      externalId={props.externalId as string}
      redirectUrl={props.redirectUrl as string}
      additionalTransactions={props.additionalTransactions as unknown[]}
      useFiat={props.useFiat as boolean}
      onRampSuccess={(session) => {
        close();
        if (props.onRampSuccess) (props.onRampSuccess as (session: unknown) => void)(session);
      }}
      onRampFailure={(error) => {
        close();
        if (props.onRampFailure) (props.onRampFailure as (error: string) => void)(error);
      }}
      onRampCancel={() => {
        close();
        if (props.onRampCancel) (props.onRampCancel as () => void)();
      }}
    />
  </Modal>);
}
