import CryptoJS from "crypto-js"

// Secret key (should be shared securely between client and server)
const secretKey = process.env.REACT_APP_TOKEN_ENCRYPTION_STRING;

// Payload to encrypt

const encryptPayload = (payload)=>{
    // Encrypt the payload
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
    
    // console.log("Encrypted Payload:", ciphertext);
    return {payload: ciphertext}
}

export default encryptPayload;
