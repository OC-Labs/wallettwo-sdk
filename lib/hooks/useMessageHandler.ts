import { useStoreWalletTwo } from "../store";
import WalletTwoAPI from "../api/Wallettwo";

export default function useMessageHandler () {
  const { setLoading, setToken, setUser } = useStoreWalletTwo();

  const headlessLogin = async (event: MessageEvent) => {
    if (event.origin !== "https://wallet.wallettwo.com") return;
    const { code, type } = event.data;

    if(type !== "wallet_login") {
      window.removeEventListener("message", headlessLogin);
      return setLoading(false);
    }

    try {
      const { access_token } = await WalletTwoAPI.exchangeConsentToken(code);
      setToken(access_token);
    } catch (error) {
      console.error("Error exchanging consent token:", error);
    }

    window.removeEventListener("message", headlessLogin);
    setLoading(false);
  }

  const login = async (event: MessageEvent) => {
    if (event.origin !== "https://wallet.wallettwo.com") return;
    const { code, type } = event.data;

    if(type !== "wallet_login") return;

    try {
      const { access_token } = await WalletTwoAPI.exchangeConsentToken(code);
      setToken(access_token);
    } catch (error) {
      console.error("Error exchanging consent token:", error);
    }

    window.removeEventListener("message", login);
  }

  const logout = async () => {
    const iframe = document.getElementById("wallettwo-headless-logout-iframe");
    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://wallet.wallettwo.com") return;
        if (event.data.type === "wallet_logout") {
          localStorage.removeItem("wallettwo_token");
          setUser(null);
          setToken(null);
          
          window.removeEventListener("message", handleMessage);
          if(iframe && iframe.parentNode === document.body) {
            document.body.removeChild(iframe);
          }
          clearTimeout(timeoutId);
          resolve(event.data);
        }
      }

      const timeoutId = setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        if(iframe && iframe.parentNode === document.body) {
          document.body.removeChild(iframe);
        }
        reject(new Error("Logout timed out"));
      }, 10000); // 10 seconds timeout

      window.addEventListener("message", handleMessage);
    });
  }

  return {
    headlessLogin,
    login,
    logout
  }
  
}