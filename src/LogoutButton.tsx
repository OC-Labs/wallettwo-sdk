import useWalletTwo from "../lib/hooks/useWalletTwo";

export default function LogoutButton() {
  const { user, signMessage, logout } = useWalletTwo();

  if(!user) return null;

  return (<>
    <button className="bg-red-500 text-white px-4 py-2 rounded ml-4" onClick={logout}>
      Logout
    </button>
    <button className="bg-blue-500 text-white px-4 py-2 rounded ml-4" onClick={async () => console.log(await signMessage("Hello from Wallettwo SDK!"))}>
      Sign Message
    </button>
  </>);
}