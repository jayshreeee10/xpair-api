const express = require('express');
const router = express.Router();
const { getXpairData } = require('../controllers/xpairController');

router.post('/xpair', getXpairData);
module.exports = router;
