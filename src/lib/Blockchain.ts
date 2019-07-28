import stringify from 'json-stable-stringify';
import Block, { createBlock, validateBlock } from './Block';
import { hash } from './Crypto';
import Transaction from './Transaction';

interface Blockchain {
  readonly chain: ReadonlyArray<Block>;
  readonly pendingTransactions: ReadonlyArray<Transaction>;
  readonly difficulty: number;
  readonly reward: number;
}

export const addBlock = (blockchain: Blockchain, block: Block): Blockchain => {
  const transactions = blockchain.pendingTransactions.filter(
    transaction =>
      !block.transactions
        .map(blockTransaction => blockTransaction.signature)
        .includes(transaction.signature)
  );
  return {
    ...blockchain,
    chain: [...blockchain.chain, block],
    pendingTransactions: [...transactions]
  };
};

export const addTransaction = (
  blockchain: Blockchain,
  transaction: Transaction
) => {
  return {
    ...blockchain,
    pendingTransactions: [...blockchain.pendingTransactions, transaction]
  };
};

export const validateChain = (blockchain: Blockchain): boolean => {
  // tslint:disable-next-line
  for (let index = blockchain.chain.length - 1; index > 0; index -= 1) {
    const block: Block = blockchain.chain[index];
    const previusBlock: Block = blockchain.chain[index - 1];
    const previusBlockHash: string = hash(stringify(previusBlock));

    // tslint:disable-next-line
    if (!(validateBlock(block) && block.previousHash === previusBlockHash)) {
      return false;
    }
  }

  return true;
};

export const checkTransaction = (
  blockchain: Blockchain,
  recievedTransaction: Transaction
): boolean => {
  const found = blockchain.pendingTransactions.find(
    transaction => transaction.signature === recievedTransaction.signature
  );

  return found !== null;
};

export const createBlockChain = (): Blockchain => {
  const blockchain = {
    chain: [],
    difficulty: 4,
    pendingTransactions: [],
    reward: 10
  };
  const genesisBlock = createBlock([], undefined, 0, 1337);
  return addBlock(blockchain, genesisBlock);
};

export default Blockchain;
