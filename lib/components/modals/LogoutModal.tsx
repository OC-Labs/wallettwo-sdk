import LogoutAction from "../actions/LogoutAction";
import Modal from "./Modal";

export default function LogoutModal() {
  return (<Modal name="logout-modal" title="Authenticate with WalletTwo" className="w-[420px] h-[620px]">
    <LogoutAction/>
  </Modal>);
}