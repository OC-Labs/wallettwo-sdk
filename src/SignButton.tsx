import useWalletTwo from "../lib/hooks/WalletTwo/useWalletTwo";

export default function SignButton() {
  const { user, signMessage } = useWalletTwo();

  if(!user) return null;

  return (
    <button onClick={async() => {
      const response = await signMessage("Hello, World!")
      console.log("Signed Message Response:", response);
    }}>
      Sign Message
    </button>
  );
}