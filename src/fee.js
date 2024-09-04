import { UserTypes, Opearations } from './constants.js';

/**
 * Fee is a base class. It is defined to
 * inherit from all othe fees.
 */
export class Fee {
    constructor(operation, feeConfig) {
        this.operation = operation;
        this.feeConfig = feeConfig;
    }

    /**
    * Returns fee with based on percents
    * @return {number} - initial fee
    */
    getInitialFee() {
        return this.operation.operation.amount * this.feeConfig.percents / 100;
    }

    /**
    * Rounding to the smallest item to upper bound
    * @param {number} fee - calculated fee
    * @return {string} - rounded fee
    */
    roundFee = (fee) => (Math.ceil(fee * 100) / 100).toFixed(2)
}

export class CachInFee extends Fee {
    constructor(operation, feeConfig) {
        if (operation.type !== Opearations.cachIn) {
            throw new Error('Wrong operation type for CachInFee!');
        }
        super(operation, feeConfig);
    }

    /**
    * Returns fee for operation type cash_in with both user types
    * @return {string} - calculated and routed fee
    */
    calculateFee() {
        const initialFee = this.getInitialFee();
        const resultFee = initialFee > this.feeConfig.max.amount ? this.feeConfig.max.amount : initialFee;

        return this.roundFee(resultFee);
    }
}

export class CachOutJuridicalFee extends Fee {
    constructor(operation, feeConfig) {
        if (operation.type !== Opearations.cachOut || operation.user_type !== UserTypes.juridical) {
            throw new Error('Wrong operation or user type for CachOutJuridicalFee!');
        }
        super(operation, feeConfig);
    }

    /**
    * Returns fee for operation type cash_out and user juridical
    * @return {string} - calculated and routed fee
    */
    calculateFee() {
        const initialFee = this.getInitialFee();
        const resultFee = initialFee < this.feeConfig.min.amount ? this.feeConfig.min.amount : initialFee;

        return this.roundFee(resultFee);
    }
}

export class CachOutNaturalFee extends Fee {
    constructor(operation, feeConfig, totalAmout) {
        if (operation.type !== Opearations.cachOut || operation.user_type !== UserTypes.natural) {
            throw new Error('Wrong operation or user type for CachOutNaturalFee!');
        }
        super(operation, feeConfig);
        this.totalAmout = totalAmout;
    }

    /**
    * Returns fee for operation type cash_out and user natural
    * @return {string} - calculated and routed fee
    */
    calculateFee() {
        const { amount: weekLimitAmout } = this.feeConfig.week_limit;
        const { amount: cashAmount } = this.operation.operation;

        if (this.totalAmout > weekLimitAmout) {
            return this.roundFee(this.getInitialFee());
        } else if (cashAmount + this.totalAmout > weekLimitAmout) {
            return this.roundFee((cashAmount + this.totalAmout - weekLimitAmout) * this.feeConfig.percents / 100);
        }

        return this.roundFee(0);
    }
}