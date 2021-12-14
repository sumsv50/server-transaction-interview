function transformStringDate(date) {
    const dates = date.split('/');
    [dates[0], dates[1]] = [dates[1], dates[0]];
    return dates.join('/');
}

const criteriaList = [
    function currency(queryString) {
        const currency = queryString.currency;
        if(currency) {
            return {currencyCode: currency};
        }
        return null;
    },

    function status(queryString) {
        const status = queryString.status;
        if(status) {
            return {status};
        }
        return null;
    },
    function dateRange(queryString) {
        const start = queryString.start;
        const end = queryString.end;
        if(!start || !end) {
            if(!start && !end) {
                return null;
            }
            throw "invalid date range";
        }

        const endDate = new Date(transformStringDate(end));
        const startDate = new Date(transformStringDate(start));

        if(isNaN(endDate) || isNaN(startDate)) {
            throw "invalid date";
        }

        if(endDate < startDate) {
            throw "invalid date range";
        }

        return {
            transactionDate: {
                $gte: startDate,
                $lte: endDate
            }
        }

    }

]

function getCriteriaTransactionQuery(queryString) {
    const query = {};
    criteriaList.forEach(criteria => {
        const field = criteria(queryString);
        if(field) {
            Object.assign(query, field);
        }
    })
    return query;
}

function transformToTransactionRes(transactions) {
    return transactions.map(transaction => ({
        id: transaction.transactionId,
        payment: transaction.amount + ' ' + transaction.currencyCode,
        Status: transformStatus(transaction.status)
    })) 
}


function transformStatus(status) {
    if(status === "Approved") return "A";
    if(status === "Failed" || status === "Rejected") return "R";
    if(status === "Finished" || status === "Done") return "D";
    return "";
}

module.exports = { getCriteriaTransactionQuery, transformToTransactionRes };