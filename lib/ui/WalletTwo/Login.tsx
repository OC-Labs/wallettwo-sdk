import useWalletTwo from "../../hooks/WalletTwo/useWalletTwo";

export default function WalletTwoLogin({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { user } = useWalletTwo();

  if(user) {
    return <div>Logged in as {user?.email}</div>;
  }

  if(!props.style || !props.className) props.style = {
    width: '400px',
    height: '600px',
    border: 'none'
  };

  return (<iframe src="https://wallet.wallettwo.com/auth/login?action=auth&iframe=true" {...props}></iframe>);
}