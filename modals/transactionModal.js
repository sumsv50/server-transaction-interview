const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const Transaction = new Schema({
    transactionId: String,
    amount: String, 
    currencyCode: String, 
    transactionDate: {
        type: Date,
        cast: (date => new Date(date))
    }, 
    createdBy:  ObjectId,
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Failed", "Done", "Finished"]
    } 
}, { timestamps: true });

// Model name => collection
module.exports = mongoose.model('Transaction', Transaction);