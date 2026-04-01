import useModal from "../../hooks/useModal";
import Modal from "./Modal";
import AuthView from "../actions/AuthAction"

export default function AuthModal() {
  const { modal } = useModal("auth-modal");
  const autoAccept = modal?.props?.autoAccept as boolean | undefined;

  return (<Modal name="auth-modal" title="Authenticate with WalletTwo" className="w-[420px] h-[620px]">
    <AuthView autoAccept={autoAccept} />
  </Modal>);
}