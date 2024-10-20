import CryptoJS from "crypto-js";

const AES_KEY = process.env.REACT_APP_AES_KEY;
const iv = CryptoJS.lib.WordArray.create(0);

export const aesEncrypt = (text) => {
  const key = CryptoJS.enc.Base64.parse(AES_KEY);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const aesDecrypt = (cipherText) => {
  const key = CryptoJS.enc.Base64.parse(AES_KEY);
  const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
