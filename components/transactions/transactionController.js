const transactionService = require('./transactionService');
const {getCriteriaTransactionQuery, transformToTransactionRes} = require('./transactionHelper');

class transactionController {
    async getTransactions(req, res, next) {
        try {
            const query =  getCriteriaTransactionQuery(req.query);
            if(Object.keys(query).length === 0) {
                return res.json({});
            }
            const transactions = await transactionService.getTransactions(query);
            const response = transformToTransactionRes(transactions);
            res.json({response});
        } catch(err) {
            console.log(err);
            res.json({fail: "fail"})
        }
              
    }
}

module.exports = new transactionController();