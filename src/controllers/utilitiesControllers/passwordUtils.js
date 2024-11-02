import bcrypt from 'bcryptjs';

// Salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

/**
 * Hashes the password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password to compare.
 * @returns {Promise<boolean>} - True if passwords match, else false.
 */
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Encodes data to Base64.
 * @param {string} data - The data to encode.
 * @returns {string} - The Base64 encoded data.
 */
export const encodeBase64 = (data) => {
    return btoa(data);
};

/**
 * Decodes data from Base64.
 * @param {string} encodedData - The Base64 encoded data.
 * @returns {string} - The decoded data.
 */
export const decodeBase64 = (encodedData) => {
    return atob(encodedData);
};
