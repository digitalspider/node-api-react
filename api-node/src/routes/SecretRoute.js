const express = require('express');
const router = express.Router();
const SecretController
  = require('./../controllers/SecretController');

// SecretController routes
router.post('/reset/:name?', SecretController.reset);

module.exports = router;
