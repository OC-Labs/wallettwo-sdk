import useWalletTwo from "../lib/hooks/WalletTwo/useWalletTwo";

export default function LogoutButton() {
  const { user, logout } = useWalletTwo();

  if(!user) return null;

  return (
    <button className="bg-red-500 text-white px-4 py-2 rounded ml-4" onClick={logout}>
      Logout
    </button>
  );
}