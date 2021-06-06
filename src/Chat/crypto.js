const CryptoJS = require("crypto-js");

const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, "my-secret-key@123");
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedData);
  return decryptedData;
};

export default decrypt;
