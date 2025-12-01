import { useEffect, useState } from "react";
import { WalletTwoContext } from "./WalletTwoContext";
import WalletTwoAPI from "../../api/Wallettwo";

export default function WalletTwoProvider({ children, loader }: { children: React.ReactNode, loader?: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<null | { id: string; email: string }>(null);

  const init = async () => {
    const localToken = localStorage.getItem("wallettwo_token");
    if(!localToken) return setLoading(false);;

    const fetchedUser = await WalletTwoAPI.userInfo(localToken);
    if(!fetchedUser) return setLoading(false);
    setUser(fetchedUser);
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <WalletTwoContext.Provider value={{
      loading, setLoading,
      user, setUser,
      init
    }}>
      {loading ? (loader ? loader : <div>Loading...</div>) : children}
    </WalletTwoContext.Provider>
  );
}