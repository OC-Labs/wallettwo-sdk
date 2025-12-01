import useWalletTwo from "../lib/hooks/WalletTwo/useWalletTwo";

export default function LogoutButton() {
  const { logout } = useWalletTwo();

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}