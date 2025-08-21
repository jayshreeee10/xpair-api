const express = require('express');
const router = express.Router();
const xpairController = require('../controllers/xpairController');



router.post('/xpair_io_json', xpairController.getXpairData);

router.post('/xpair/status', xpairController.getXpairStatus);

router.post('/xpair_io_json_with_validation', xpairController.getXpairDataWithValidation);



module.exports = router;