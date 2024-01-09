import crypto from 'crypto';

const hashConfig = {
    Iterations: 10000,
    KeyLength: 64,
    Digest: 'sha512'
};

/**
 * Create hashed password
 * @param {String} plainPassword
 * @return {{salt: string, hash: string}} returns salt and hashed password
 */
const hashPassword = (plainPassword: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    let hash = '';
    try {
        hash = crypto.pbkdf2Sync(plainPassword, salt, hashConfig.Iterations, hashConfig.KeyLength, hashConfig.Digest).toString('hex');
    } catch (e) {
        throw e;
    }
    return { salt, hash };
};

/**
 * Check whether the password is valid or not
 * @param {String} plainPassword
 * @param {String} hashedPassword
 * @param {String} salt
 * @return {Boolean}
 */
const validate = (plainPassword: string, hashedPassword: string, salt: string) => {
    let hash = '';
    try {
        hash = crypto.pbkdf2Sync(plainPassword, salt, hashConfig.Iterations, hashConfig.KeyLength, hashConfig.Digest).toString('hex');
    } catch (e) {
        return false;
    }

    return hash === hashedPassword;
};

export {
    hashPassword,
    validate
};
