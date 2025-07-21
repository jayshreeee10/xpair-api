const express = require('express');
const router = express.Router();
const xpairAttributeController = require('../controllers/xpairAttributeController');

router.get('/xpair-attributes', xpairAttributeController.getAllXpairAttributes);
router.get('/xpair-attributes/:id', xpairAttributeController.getXpairAttribute);
router.post('/xpair-attributes', xpairAttributeController.createXpairAttribute);
router.put('/xpair-attributes/:id', xpairAttributeController.updateXpairAttribute);
router.delete('/xpair-attributes/:id', xpairAttributeController.deleteXpairAttribute);


module.exports = router;
