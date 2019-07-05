const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentController');

// Doc routes
router.get('/download/:token', documentController.download);

module.exports = router;
