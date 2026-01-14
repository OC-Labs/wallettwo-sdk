import { useEffect } from "react";
import useMessageHandler from "../../hooks/useMessageHandler";
import { useStoreWalletTwo } from "../../store";

export default function AuthView({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { user } = useStoreWalletTwo();
  const message = useMessageHandler();

  useEffect(() => {
    window.addEventListener("message", message.login);
    
    return () => {
      window.removeEventListener("message", message.login);
    };
  }, []);

  if(user) return <div>Logged in as {user?.email}</div>;

  if(!props.style || !props.className) props.style = {
    width: '400px',
    height: '600px',
    border: 'none'
  };

  return (<iframe src="https://wallet.wallettwo.com/auth/login?action=auth&iframe=true" {...props}></iframe>);
}