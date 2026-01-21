import Modal from "./Modal";
import AuthView from "../actions/AuthAction"

export default function AuthModal() {
  return (<Modal name="auth-modal" title="Authenticate with WalletTwo" className="w-[420px] h-[620px]">
    <AuthView />
  </Modal>);
}