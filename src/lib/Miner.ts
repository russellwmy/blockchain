import stringify from 'json-stable-stringify';
import Block, { createBlock, validateBlock } from "./Block";
import Blockchain from "./Blockchain";
import { hash } from './Crypto';
import Transaction, { createTransaction, signTransaction } from "./Transaction";
import Wallet from "./Wallet";

export const proofOfWork = (block: Block): Block => {
  // tslint:disable-next-line
  let nonce: number = 0;
  while (true) {
    const newBlock = { ...block, nonce };
    // tslint:disable-next-line
    if (validateBlock(newBlock)) {
      return newBlock;
    }
    // tslint:disable-next-line
    nonce++;
  }
};

export const mine = (blockchain: Blockchain, wallet: Wallet): Block => {

  const newTransaction = createTransaction(wallet.publicKey, wallet.publicKey, blockchain.reward, true);
  // Coinbase transaction
  const coinbaseTransaction: Transaction = signTransaction(
    wallet.privateKey,
    newTransaction,
  );
  const transactions: ReadonlyArray<Transaction> = [coinbaseTransaction, ...blockchain.pendingTransactions];
  const lastBlock: Block = blockchain.chain[blockchain.chain.length - 1];
  const previousHash: string = hash(stringify(lastBlock));
  const block: Block = createBlock(transactions, previousHash, Date.now(), 0);
  const minedBlock: Block = proofOfWork(block);
  // const newBlockchain = addBlock(blockchain, minedBlock);

  return minedBlock;
};
