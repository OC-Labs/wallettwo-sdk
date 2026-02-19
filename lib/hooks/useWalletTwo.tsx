import WalletTwoAPI from "../api/Wallettwo";
import { useStoreWalletTwo } from "../store";
import useMessageHandler from "./useMessageHandler";

export default function useWalletTwo() {
  const { setUser, user, token } = useStoreWalletTwo();
  const messageHandlers = useMessageHandler();
  
  const headlessLogin = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/auth/login?action=auth&iframe=true`;
    iframe.id = `wallettwo-headless-login-iframe`;
    document.body.appendChild(iframe);

    window.addEventListener("message", messageHandlers.headlessLogin);
  }

  const loadUserFromToken = async (accessToken: string) => {
    const fetchedUser = await WalletTwoAPI.userInfo(accessToken);
    if(!fetchedUser) return;
    setUser(fetchedUser);
  }

  const logout = async () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://wallet.wallettwo.com/action/logout?iframe=true`;
    iframe.id = "wallettwo-headless-logout-iframe";
    document.body.appendChild(iframe);

    return messageHandlers.logout();
  }

  return {
    headlessLogin,
    loadUserFromToken,
    logout,
    user,
    token
  };
}