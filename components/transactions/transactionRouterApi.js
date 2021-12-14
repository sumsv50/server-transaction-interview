const express = require('express');
const router = express.Router();
const transactionController = require('./transactionController');

router.get('/', transactionController.getTransactions);

module.exports = router;
