// const express = require('express');
// const router = express.Router();
// const { getXpairData } = require('../controllers/xpairController');

// router.post('/xpair', getXpairData);
// module.exports = router;


const express = require('express');
const router = express.Router();
const xpairController = require('../controllers/xpairController');

// POST endpoint for crop sowing data
router.post('/xpair', xpairController.getCropSowingData);

module.exports = router;