// tslint:disable:no-expression-statement
import test from 'ava';
import { createBlock } from './Block';

test('createBlock', t => {
  const genesisBlock = createBlock([], undefined, 0, 1337);
  t.is(genesisBlock.nonce, 1337);
});
