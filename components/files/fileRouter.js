const express = require('express');
const router = express.Router();
const fileController = require('./fileController');

/* GET home page. */
router.get('/upload-file', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST file. */
router.post('upload-file', fileController.uploadFile);


module.exports = router;
