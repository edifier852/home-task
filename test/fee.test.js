import assert from 'node:assert';
import { it, describe } from 'node:test';
import { CachInFee, CachOutJuridicalFee, CachOutNaturalFee } from '../src/fee.js';

it('CachInFee', () => {
    const cachInFee = { percents: 0.03, max: { amount: 5, currency: "EUR" } };
    const cachInOperation = { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 245.00, "currency": "EUR" } };

    const fee = new CachInFee(cachInOperation, cachInFee)
    assert.strictEqual(fee.calculateFee(), '0.08')
});

it('CachOutJuridicalFee', () => {
    const cashOutJuridicalFee = { percents: 0.3, min: { amount: 0.5, currency: "EUR" } };
    const cashOutJuridicalOperation = { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } };

    const fee = new CachOutJuridicalFee(cashOutJuridicalOperation, cashOutJuridicalFee)
    assert.strictEqual(fee.calculateFee(), '0.90')
});



describe('CachOutNaturalFee', () => {
    const cashOutNaturalFee = { percents: 0.3, week_limit: { amount: 1000, currency: "EUR" } };
    const cashOutNaturalOperation = { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } };
    it('limit is fully exceeded', () => {
        const fee = new CachOutNaturalFee(cashOutNaturalOperation, cashOutNaturalFee, 1000)
        assert.strictEqual(fee.calculateFee(), '0.30')
    });

    it('limit is exceeded partially', () => {
        const fee = new CachOutNaturalFee(cashOutNaturalOperation, cashOutNaturalFee, 950)
        assert.strictEqual(fee.calculateFee(), '0.15')
    });

    it('limit is not exceeded', () => {
        const fee = new CachOutNaturalFee(cashOutNaturalOperation, cashOutNaturalFee, 0)
        assert.strictEqual(fee.calculateFee(), '0.00')
    });
});


