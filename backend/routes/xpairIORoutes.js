const express = require('express');
const router = express.Router();
const xpairIOController = require('../controllers/xpairIOController');

router.get('/xpair-io', xpairIOController.getAllXpairIOs);

module.exports = router;