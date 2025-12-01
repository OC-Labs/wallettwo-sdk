import axios from "axios";

export default class WalletTwoAPI {
  static _baseUrl = import.meta?.env?.VITE_WALLETTWO_URL || 'https://api.wallettwo.com';
  static _authUrl = `${WalletTwoAPI._baseUrl}/auth`;
  static #accessToken = localStorage.getItem('wallettwo_token') || null;

  static headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${WalletTwoAPI.#accessToken}`
  };

  static updateAccessToken(accessToken: string) {
    WalletTwoAPI.#accessToken = accessToken;
    WalletTwoAPI.headers['Authorization'] = `Bearer ${accessToken}`;
    localStorage.setItem('wallettwo_token', accessToken);
  }
  

  static async userInfo(accessToken: string) {
    const { data } = await axios.get(`${WalletTwoAPI._authUrl}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    WalletTwoAPI.updateAccessToken(accessToken);
    return data;
  }

    static async exchangeConsentToken(code: string) {
    if (!code) throw new Error('Code is required to exchange consent token.');
    const { data } = await axios.get(`${WalletTwoAPI._authUrl}/consent?code=${code}`);
    return data;
  }
}