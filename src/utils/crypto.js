import CryptoJS from 'crypto-js';
import { STATIC_AES_KEY } from '../serviceurls';


// export const encryptData = (data) => {
//   const key = CryptoJS.enc.Utf8.parse(STATIC_AES_KEY.padEnd(32).substring(0, 32));
//   const iv = CryptoJS.enc.Utf8.parse('\0'.repeat(16));

//   const encrypted = CryptoJS.AES.encrypt(
//     JSON.stringify(data),
//     key,
//     {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     }
//   );

//   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// };

export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), STATIC_AES_KEY).toString();
  return encryptedData;
};



export const decryptData = (encryptedData) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(STATIC_AES_KEY.padEnd(32).substring(0, 32));
    const iv = CryptoJS.enc.Utf8.parse('\0'.repeat(16)); // Same as new byte[16] in C#

    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) throw new Error("Decryption returned empty or invalid UTF-8");

    return JSON.parse(decryptedText);
  } catch (error) {
    // console.error("🔐 Decryption Error:", error.message);
    // console.error("Encrypted Input:", encryptedData);
    return null;
  }
};

// export const decryptData = (encryptedData) => {
//   try {
//     const key = CryptoJS.enc.Utf8.parse(STATIC_AES_KEY.padEnd(32).substring(0, 32));
//     const iv = CryptoJS.enc.Utf8.parse('\0'.repeat(16));

//     const decrypted = CryptoJS.AES.decrypt(
//       {
//         ciphertext: CryptoJS.enc.Base64.parse(encryptedData),
//       },
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       }
//     );

//     const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

//     if (!decryptedText) throw new Error("Decryption returned empty or invalid UTF-8");

//     return JSON.parse(decryptedText);
//   } catch (error) {
//     console.error("Decryption Error:", error.message);
//     console.error("Encrypted Input:", encryptedData);
//     return null;
//   }
// };