// tslint:disable:no-expression-statement
import test from 'ava';
import { createWallet } from './Wallet';

test('createWallet', t => {
  const wallet = createWallet();
  t.is(wallet.privateKey !== undefined, true);
  t.is(wallet.publicKey !== undefined, true);
});
