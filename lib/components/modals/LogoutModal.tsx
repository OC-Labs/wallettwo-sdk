import useModal from "../../hooks/useModal";
import LogoutAction from "../actions/LogoutAction";
import Modal from "./Modal";

export default function LogoutModal() {
  const { modal } = useModal("logout-modal");
  const autoAccept = modal?.props?.autoAccept as boolean | undefined;

  return (<Modal name="logout-modal" title="Authenticate with WalletTwo" className="w-[420px] h-[620px]">
    <LogoutAction autoAccept={autoAccept} />
  </Modal>);
}