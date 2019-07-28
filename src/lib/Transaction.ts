import stringify from 'json-stable-stringify';
import { hash, signWithPrivateKey, verifyWithPublicKey } from './Crypto';

interface Transaction {
  readonly sender: string; // Public key address of a transaction sender
  readonly recipient: string; // Public key address of a transaction recipient
  readonly amount: number; // Amount of coins to be transferred
  readonly timestamp: number; // Unix time when transaction was created
  readonly coinbase: boolean; // True if it's a coinbase transaction ie. transaction that awards the miner and creates new coins
  readonly signature?: string; // Transaction hash encrypted with the private key of the sender
}

export const createTransaction = (
  sender: string,
  recipient: string,
  amount: number,
  coinbase: boolean = false,
  timestamp: number = Date.now()
): Transaction => {
  return {
    amount,
    coinbase,
    recipient,
    sender,
    timestamp
  };
};

export const signTransaction = (
  privateKey: string,
  transaction: Transaction
): Transaction => {
  const transactionHash: string = hash(stringify(transaction));
  const signature: string = signWithPrivateKey(privateKey, transactionHash);

  return { ...transaction, signature };
};

export const validateTransaction = (transaction: Transaction): boolean => {
  const { signature, ...transactionData } = transaction;
  const transactionHash: string = hash(stringify(transactionData));

  return verifyWithPublicKey(transaction.sender, transactionHash, signature);
};

export default Transaction;
