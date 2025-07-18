const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attributeController');

router.get('/attributes', attributeController.getAllAttributes);
router.get('/attributes/:id', attributeController.getAttribute);
router.post('/attributes', attributeController.createAttribute);
router.put('/attributes/:id', attributeController.updateAttribute);
router.delete('/attributes/:id', attributeController.deleteAttribute);

module.exports = router;