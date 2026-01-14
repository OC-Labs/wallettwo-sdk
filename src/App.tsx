import WalletTwoProvider from "../lib/components/WalletTwoProvider"
import AuthView from "../lib/ui/auth"
import LogoutButton from "./LogoutButton"

export default function App() {

  return <WalletTwoProvider>
    <>Test</>
    <AuthView />
    <LogoutButton />
    {/*<WalletTwoLogin />
    <SignButton />
    <LogoutButton />*/}
  </WalletTwoProvider>
}