import * as stringify from 'json-stable-stringify';

import Transaction from './Transaction';
import Block from './Block';

import {
  hash,
  generateKeyPair,
  signWithPrivateKey,
  verifyWithPublicKey,
} from './Crypto';

const Blockchain = () => {
  const chain: Array<Block> = [];
  let pendingTransactions: Array<Transaction> = [];
  const difficulty: number = 4;
  const reward: number = 10;
  const [publicKey, privateKey] = generateKeyPair();
  const createBlock = (
    transactions: Array<Transaction>,
    previousHash: string,
    timestamp: number = Date.now(),
    nonce: number = 0,
  ): Block => {

    return {
      transactions, previousHash, timestamp, nonce,
      difficulty,
    };
  };
  const createTransaction = (
    sender: string,
    recipient: string,
    amount: number,
    coinbase: boolean = false,
    timestamp: number = Date.now(),
  ): Transaction => {

    return {
      sender, recipient, amount, coinbase, timestamp,
    };
  };

  const signTransaction = (transaction: Transaction): Transaction => {
    const transactionHash: string = hash(stringify(transaction));
    const signature: string = signWithPrivateKey(privateKey, transactionHash);

    transaction.signature = signature;

    return transaction;
  };

  const validateTransaction = (transaction: Transaction): boolean => {
    const { signature, ...transactionData } = transaction;
    const transactionHash: string = hash(stringify(transactionData));

    return verifyWithPublicKey(transaction.sender, transactionHash, signature);
  }
  const addBlock = (block: Block) => {
    chain.push(block);
    const transactions = pendingTransactions
      .filter(transaction => !block.transactions
        .map(blockTransaction => blockTransaction.signature)
        .includes(transaction.signature),
      );
    pendingTransactions = [...transactions]
  };
  const addTransaction = (transaction: Transaction) => {
    pendingTransactions.push(transaction);
  }
  const validateBlock = (block: Block): boolean => {
    const difficulty: number = block.difficulty;
    const blockHash: string = hash(stringify(block));
    const zeroString: string = '0'.repeat(difficulty);

    return blockHash.indexOf(zeroString) === 0;
  };

  const mine = (): Block => {

    // Coinbase transaction
    const coinbaseTransaction: Transaction = signTransaction(
      createTransaction(publicKey, publicKey, reward, true),
    );
    const transactions: Array<Transaction> = [coinbaseTransaction, ...pendingTransactions];
    const lastBlock: Block = chain[chain.length - 1];
    const previousHash: string = hash(stringify(lastBlock));
    const block: Block = createBlock(transactions, previousHash, Date.now(), 0);
    const minedBlock: Block = proofOfWork(block);

    addBlock(minedBlock);

    return minedBlock;
  };
  const proofOfWork = (block: Block): Block => {
    block.nonce = 0;
    while (!validateBlock(block)) {
      block.nonce += 1;
    }

    return block;
  };
  const validateChain = (): boolean => {
    for (let index = chain.length - 1; index > 0; index -= 1) {
      const block: Block = chain[index];
      const previusBlock: Block = chain[index - 1];
      const previusBlockHash: string = hash(stringify(previusBlock));

      if (!(validateBlock(block) && (block.previousHash === previusBlockHash))) {
        return false;
      }
    }

    return true;
  };
  const checkTransaction = (recievedTransaction: Transaction): boolean => {
    const found = pendingTransactions.find(transaction => transaction.signature === recievedTransaction.signature);

    return Boolean(found);
  };
  const genesisBlock = createBlock([], undefined, 0, 1337);

  addBlock(genesisBlock);

  return {
    publicKey,
    privateKey,
    chain,
    pendingTransactions,
    createBlock,
    createTransaction,
    signTransaction,
    validateTransaction,
    addBlock,
    addTransaction,
    validateBlock,
    mine,
    proofOfWork,
    validateChain,
    checkTransaction,
  };
};

export default Blockchain;