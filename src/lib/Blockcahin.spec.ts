// tslint:disable:no-expression-statement
import test from 'ava';
import { createBlockChain } from './Blockchain';

test('createBlockChain', t => {
  const blockchain = createBlockChain();
  t.is(blockchain.chain.length, 0);
});
