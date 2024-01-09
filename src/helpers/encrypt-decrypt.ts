import crypto from 'crypto';
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

interface DecryptValue {
    iv: string
    encryptedData: string
}

//Encrypting
const encrypt = (value: string) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting
const decrypt = (value: DecryptValue) => {
    let iv = Buffer.from(value.iv, 'hex');
    let encryptedText = Buffer.from(value.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export {
    encrypt,
    decrypt
};
