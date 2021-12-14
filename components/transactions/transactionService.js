const transactionModal = require('../../modals/transactionModal');

class transactionService {
    async getTransactions(query) {
        return await transactionModal.find(query).lean();
    }
}

module.exports = new transactionService();