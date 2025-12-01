import { useEffect } from "react";
import useWalletTwo from "../../hooks/WalletTwo/useWalletTwo";

export default function WalletTwoLogin({
  onLoginSuccess = (data: any) => { console.log(data); }
}: {
  onLoginSuccess: (data: any) => void
}) {
  const { user, exchangeConsentToken } = useWalletTwo();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Ensure the message is coming from the expected origin
      if (event.origin !== "https://wallet.wallettwo.com") return;
      const { data } = event;
      const { code } = event.data;
      await exchangeConsentToken(code);
      onLoginSuccess(data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onLoginSuccess]);

  if(user) {
    return <div>Logged in as {user?.email}</div>;
  }

  return (<iframe src="https://wallet.wallettwo.com/auth/login?action=auth&iframe=true" style={{ width: '400px', height: '800px', border: 'none' }}></iframe>);
}