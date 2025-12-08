import WalletTwoProvider from "../lib/hooks/WalletTwo/WalletTwoProvider"
import WalletTwoLogin from "../lib/ui/WalletTwo/Login"
import LogoutButton from "./LogoutButton.tsx";
import SignButton from "./SignButton.tsx";

export default function App() {

  return <WalletTwoProvider>
    <WalletTwoLogin />
    <SignButton />
    <LogoutButton />
  </WalletTwoProvider>
}