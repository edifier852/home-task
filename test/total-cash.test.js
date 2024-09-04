import assert from 'node:assert';
import { it, describe } from 'node:test';
import { TotalCach } from '../src/total-cach.js';


describe('TotalCach', () => {
    it('checking total cash', () => {
        const testAmount = [{ key: 'one', amount: 22 }, { key: 'one', amount: 33 }, { key: 'two', amount: 23 }]
        const totalCach = new TotalCach()
        testAmount.forEach(({ key, amount }) => totalCach.setAmout(key, amount))
        assert.strictEqual(totalCach.getAmount('one'), 55);
        assert.strictEqual(totalCach.getAmount('two'), 23);
    });

    it('getOperationKey', () => {
        assert.strictEqual(TotalCach.getOperationKey('one', '2024-09-04'), 'one-2024-09');
    });

    it('checkIsCashOutLimitEnabled', () => {
        assert.strictEqual(TotalCach.checkIsCashOutLimitEnabled({ type: 'cash_out', user_type: 'natural' }), true);
    });
});
