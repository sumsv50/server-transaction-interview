const express = require('express');
const router = express.Router();
const fileController = require('./fileController');

/* POST file. */
router.post('/upload-file', fileController.uploadFile);

module.exports = router;