// tslint:disable:no-expression-statement
import test from 'ava';
import { createTransaction } from './Transaction';

test('createTransaction', t => {
  const transaction = createTransaction('a', 'b', 10);
  t.is(transaction.amount, 10);
});
