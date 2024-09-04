import { UserTypes, Opearations } from './constants.js';

/**
 * TotalCach is defined to get monthly total cash out
 * using user id and operation date as a key
 */
export class TotalCach {
    constructor() {
        this.map = new Map();
    }

    static getOperationKey = (userId, operationDate) => {
        const indexOf = operationDate.lastIndexOf('-');
        const monthKey = operationDate.substring(0, indexOf)

        return `${userId}-${monthKey}`;
    }

    static checkIsCashOutLimitEnabled = ({ type, user_type }) => type === Opearations.cachOut && user_type === UserTypes.natural;

    setAmout(key, amount) {
        const resultAmoutn = (this.map.get(key) ?? 0) + amount;
        this.map.set(key, resultAmoutn);
    }

    getAmount(key) {
        return this.map.get(key) ?? 0;
    }
}