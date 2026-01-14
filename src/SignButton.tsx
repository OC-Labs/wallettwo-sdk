import useWalletTwo from "../lib/hooks/useWalletTwo";

export default function SignButton() {
  const { user, redirectToWalletTwo, executeTransaction, openRamp } = useWalletTwo();

  if(!user) return null;

  return (<>
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
      onClick={async() => {
      const response = await redirectToWalletTwo()
      console.log("Signed Message Response:", response);
    }}>
      Sign Message
    </button>

    <button 
      className="bg-green-500 text-white px-4 py-2 rounded ml-4"
      onClick={async() => {
        await executeTransaction({
          networkId: 80002,
          methods: ['faucet', 'faucet'],
          params: [[]],
          addresses: ['0xfa86C7c30840694293a5c997f399d00A4eD3cDD8'],
          redirectURI: ['https://yourapp.com/transaction-complete'],
          optionalAbis: ['ERC20Faucet']
        })
      }}
    >
      Execute Transaction
    </button>

    <button 
      className="bg-purple-500 text-white px-4 py-2 rounded ml-4"
      onClick={async() => {
        await openRamp({
          onFinish: () => {
            console.log("Ramp finished successfully");
          },
          onCancel: () => {
            console.log("Ramp was cancelled");
          }
        })
      }}
    >
      Open Ramp
    </button>
  </>);
}