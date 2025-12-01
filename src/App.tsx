import WalletTwoProvider from "../lib/hooks/WalletTwo/WalletTwoProvider"
import WalletTwoLogin from "../lib/ui/WalletTwo/Login"

export default function App() {

  return <WalletTwoProvider>
    <WalletTwoLogin />
  </WalletTwoProvider>
}