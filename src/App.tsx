import WalletTwoProvider from "../lib/hooks/WalletTwo/WalletTwoProvider"
import { useWalletTwo } from "../lib/main";
import WalletTwoLogin from "../lib/ui/WalletTwo/Login"
import LogoutButton from "./LogoutButton";

export default function App() {

  return <WalletTwoProvider>
    <WalletTwoLogin />
    <LogoutButton />
  </WalletTwoProvider>
}