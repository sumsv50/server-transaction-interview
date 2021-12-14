const transactionModal = require('../../modals/transactionModal');

class fileService {
    async saveTransactions(transactions) {
        return await transactionModal.insertMany(transactions);
    }
}

module.exports = new fileService();