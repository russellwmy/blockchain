import Transaction from './Transaction';

interface Block {
  readonly transactions: Array<Transaction>; // Array of transactions
  readonly previousHash?: string;            // Hexadecimal hash of a previous Block in the chain
  readonly timestamp?: number;               // Unix time when Block was mined
   nonce: number;                    // Cryptographic nonce number
  readonly difficulty: number;               // Number representing the mining difficulty
}

export default Block;