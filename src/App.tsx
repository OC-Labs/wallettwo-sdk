import AuthAction from "../lib/components/actions/AuthAction"
import WalletTwoProvider from "../lib/components/WalletTwoProvider"
import LogoutButton from "./LogoutButton"

export default function App() {

  return <WalletTwoProvider>
    <>Test</>
    <AuthAction />
    <LogoutButton />
    {/*<WalletTwoLogin />
    <SignButton />
    <LogoutButton />*/}
  </WalletTwoProvider>
}