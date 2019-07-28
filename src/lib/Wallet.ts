import { generateKeyPair } from './Crypto';

export interface Wallet {
  readonly publicKey: string;
  readonly privateKey: string;
}

export const createWallet = (): Wallet => {
  const [publicKey, privateKey] = generateKeyPair();

  return {
    privateKey,
    publicKey
  };
};
