// @ts-ignore
import * as crypto from 'crypto';
import * as rsasign from 'jsrsasign';

// ECDSA - Elliptic Curve Digital Signature Algorithm
// Generate the curve used in key generation
const curve = 'secp128r1';
const ec = new rsasign.ECDSA({ curve });

// Creates SHA-256 hash of the string
export const hash = (text: string): string => {
  return crypto
    .createHash('sha256')
    .update(text)
    .digest('hex');
};

// Generates the public/private key pair
export const generateKeyPair = (): ReadonlyArray<string> => {
  const keyPair = ec.generateKeyPairHex();
  return [keyPair.ecpubhex, keyPair.ecprvhex];
};

// Encrypts the data hash with the private key
export const signWithPrivateKey = (
  privateKey: string,
  dataHash: string
): string => {
  return ec.signHex(dataHash, privateKey);
};

// Decrpypts the signature and compares it to the data hash
export const verifyWithPublicKey = (
  publicKey: string,
  dataHash: string,
  signature?: string
): boolean => {
  return ec.verifyHex(dataHash, signature, publicKey);
};
