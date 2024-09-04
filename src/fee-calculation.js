import { TotalCach } from './total-cach.js';
import { cachInFee, cashOutJuridicalFee, cashOutNaturalFee } from './configs.js';
import { UserTypes, Opearations } from './constants.js';
import { CachInFee, CachOutJuridicalFee, CachOutNaturalFee } from './fee.js';

/**
 * Factory returns correct fee
 * @param {Object} operation - The operation data with operation and user type
 * @param {number} totalAmout - Total amount of cash out for user type natural
 */
const createFee = (operation, totalAmout) => {
    if (operation.type === Opearations.cachIn) {
        return new CachInFee(operation, cachInFee);
    } else if (operation.user_type === UserTypes.juridical) {
        return new CachOutJuridicalFee(operation, cashOutJuridicalFee);
    } else if (operation.user_type === UserTypes.natural) {
        return new CachOutNaturalFee(operation, cashOutNaturalFee, totalAmout);
    }

    throw new Error('Should be defined correct operation user type!');
}

/**
 * Start of fees calculation
 *
 * @param {Object[]} operations - The operations data which you can see in the input.json file
 */
export const startFeesCalculation = (operations) => {
    const totalCashOut = new TotalCach();

    operations.forEach(operationData => {
        const userTotalKey = TotalCach.getOperationKey(operationData.user_id, operationData.date)
        const fee = createFee(operationData, totalCashOut.getAmount(userTotalKey));
        console.log(fee.calculateFee())

        if (TotalCach.checkIsCashOutLimitEnabled(operationData)) {
            totalCashOut.setAmout(userTotalKey, operationData.operation.amount)
        }
    });
}