import useWalletTwo from "../lib/hooks/WalletTwo/useWalletTwo";

export default function SignButton() {
  const { user, signMessage, executeTransaction } = useWalletTwo();

  if(!user) return null;

  return (<>
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
      onClick={async() => {
      const response = await signMessage("Hello, World!")
      console.log("Signed Message Response:", response);
    }}>
      Sign Message
    </button>

    <button 
      className="bg-green-500 text-white px-4 py-2 rounded ml-4"
      onClick={async() => {
        await executeTransaction({
          networkId: 80002,
          methods: ['faucet'],
          params: [[]],
          addresses: ['0xfa86C7c30840694293a5c997f399d00A4eD3cDD8'],
          redirectURI: ['https://yourapp.com/transaction-complete'],
          optionalAbis: ['ERC20Faucet']
        })
      }}
    >
      Execute Transaction
    </button>
  </>);
}