import { useContext } from "react";
import { WalletTwoContext } from "./WalletTwoContext";
import WalletTwoAPI from "../../api/Wallettwo";

export default function useWalletTwo() {
  const context = useContext(WalletTwoContext);
  if(!context) throw new Error("useWalletTwo must be used within a WalletTwoProvider");

  const exchangeConsentToken = async (code: string) => {
    const { access_token } = await WalletTwoAPI.exchangeConsentToken(code);
    localStorage.setItem("wallettwo_token", access_token);
    context.init();
    return access_token;
  }

  return {
    ...context,
    exchangeConsentToken
  };
}