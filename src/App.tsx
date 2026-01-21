import AuthAction from "../lib/components/actions/AuthAction"
import TransactionAction from "../lib/components/actions/TransactionAction"
import WalletTwoProvider from "../lib/components/WalletTwoProvider"
import LogoutButton from "./LogoutButton"

export default function App() {

  return <WalletTwoProvider>
    <>Test</>
    <AuthAction />
    <LogoutButton />
    <TransactionAction 
      network="80002" 
      methods={['faucet']} 
      params={[[]]} 
      addresses={['0xfa86C7c30840694293a5c997f399d00A4eD3cDD8']} 
      waitTx={true}
      abis={['ERC20Faucet']}
      onSuccess={(txId) => {
        console.log("Transaction Successful with ID:", txId);
      }}
      onFailure={(error) => {
        console.error("Transaction Failed with error:", error);
      }}
      onCancel={() => {
        console.log("Transaction was cancelled by the user.");
      }}
    />
    {/*<WalletTwoLogin />
    <SignButton />
    <LogoutButton />*/}
  </WalletTwoProvider>
}