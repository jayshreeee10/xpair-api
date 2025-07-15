

const express = require('express');
const router = express.Router();
const xpairController = require('../controllers/xpairController');



router.post('/xpair', xpairController.getXpairData);


module.exports = router;