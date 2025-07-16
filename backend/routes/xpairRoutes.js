

const express = require('express');
const router = express.Router();
const xpairController = require('../controllers/xpairController');



router.post('/xpair', xpairController.getXpairData);

router.post('/xpair/status', xpairController.getXpairStatus);



module.exports = router;