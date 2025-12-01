import useWalletTwo from "../../hooks/WalletTwo/useWalletTwo";

export default function WalletTwoLogin() {
  const { user } = useWalletTwo();

  if(user) {
    return <div>Logged in as {user?.email}</div>;
  }

  return (<iframe src="https://wallet.wallettwo.com/auth/login?action=auth&iframe=true" style={{ width: '400px', height: '800px', border: 'none' }}></iframe>);
}