import useWalletTwo from "../lib/hooks/WalletTwo/useWalletTwo";

export default function LogoutButton() {
  const { user, logout } = useWalletTwo();

  if(!user) return null;

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}