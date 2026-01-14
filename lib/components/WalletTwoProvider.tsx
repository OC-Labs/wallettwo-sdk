import { useEffect } from "react";
import { useStoreWalletTwo } from "../store";
import { useWalletTwo } from "../main";
import WalletTwoAPI from "../api/Wallettwo";

export default function WalletTwoProvider(
  { children, loader }: 
  { children: React.ReactNode, loader?: React.ReactNode 
}) {
  const { loading, token, setToken, setUser } = useStoreWalletTwo();
  const { headlessLogin } = useWalletTwo();

  useEffect(() => {
    headlessLogin();
  }, []);

  useEffect(() => {
    if(!token) return;
    WalletTwoAPI.userInfo(token).then(fetchedUser => {
      if(!fetchedUser) setToken(null);
      else setUser(fetchedUser);

      // remove wallettwo-headless-login-iframe if it exists
      const iframe = document.getElementById("wallettwo-headless-login-iframe");
      if (iframe && iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    });
  }, [token]);

  if(loading) {
    return loader ? <>{loader}</> : <div>Loading WalletTwo...</div>;
  }
  
  return (<div className="wallettwo-provider-container-root">
    {children}
  </div>);
}