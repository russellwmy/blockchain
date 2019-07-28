import stringify from 'json-stable-stringify';
import { hash } from './Crypto';
import { Transaction } from './Transaction';

export interface Block {
  readonly transactions: ReadonlyArray<Transaction>; // Array of transactions
  readonly previousHash?: string; // Hexadecimal hash of a previous Block in the chain
  readonly timestamp?: number; // Unix time when Block was mined
  readonly nonce: number; // Cryptographic nonce number
  readonly difficulty: number; // Number representing the mining difficulty
}

export const createBlock = (
  transactions: ReadonlyArray<Transaction>,
  previousHash: string,
  timestamp: number = Date.now(),
  nonce: number = 0,
  difficulty: number = 4
): Block => {
  return {
    difficulty,
    nonce,
    previousHash,
    timestamp,
    transactions
  };
};

export const validateBlock = (block: Block): boolean => {
  const blockHash: string = hash(stringify(block));
  const zeroString: string = '0'.repeat(block.difficulty);
  return blockHash.indexOf(zeroString) === 0;
};
