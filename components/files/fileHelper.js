const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const parser = require('xml2json');

function transformStringDate(date) {
    const dates = date.split('/');
    [dates[0], dates[1]] = [dates[1], dates[0]];
    return dates.join('/');
}

const parseHandleList = {
    csv(file) {
        return new Promise((resolve, reject) => {
            const transactions = [];
            fs.createReadStream(file.filepath)
                .pipe(csv(['transactionId', 'amount', 'currencyCode', 'transactionDate', 'status']))
                .on('data', function (row) {
                    if(row.transactionDate) {
                        row.transactionDate = transformStringDate(row.transactionDate);
                    }
                    transactions.push(row);
                })
                .on('end', function () {
                    resolve(transactions);
                })
        })
    },
    xml(file) {
        return new Promise((resolve, reject) => {
            fs.readFile(file.filepath, (err, data) => {
                if(err) {
                    reject(err);
                }
                const json = parser.toJson(data);
                const transactions = (JSON.parse(json))?.Transactions?.Transaction;
                if(!transactions) {
                    reject(new Error("Not valid file"));
                };

                resolve(transactions.map(transaction => ({
                    transactionId: transaction.id,
                    amount: transaction.PaymentDetails?.Amount,
                    currencyCode: transaction.PaymentDetails?.CurrencyCode,
                    transactionDate: transaction.TransactionDate,
                    status: transaction.Status
                })))
            })
        })
    }
}

function validateTransaction(transactions) {
    const invalidRecord = [];
    const requireFields = ['transactionId', 'amount', 'currencyCode', 'transactionDate', 'status'];
    transactions.forEach((transaction, index) => {
        if (requireFields.some(field => !transaction[field])) {
            invalidRecord.push(index);
        }
    });

    return invalidRecord;
}

async function parseTransactionFromFile(file) {
    const fileType = path.extname(file.originalFilename).substring(1);
    const parseHandle = parseHandleList[fileType];
    if (!parseHandle) {
        return {
            isSuccess: false,
            errorMessage: "Unknown format"
        }
    };
    const transactions = await parseHandle(file);
    
    const invalidRecord = validateTransaction(transactions);
    if (invalidRecord.length > 0) {
        return {
            isSuccess: false,
            errorMessage: invalidRecord.map(record => `Invalid record with index ${record + 1}`).join(', ')
        }
    }

    return {
        isSuccess: true,
        transactions
    }

}

module.exports = { parseTransactionFromFile };