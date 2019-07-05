const express = require('express');
const router = express.Router();
const AuthenticationController
  = require('../controllers/AuthenticationController');

// Authentication routes
router.post('/login', AuthenticationController.login);
router.get('/logout', AuthenticationController.logout);
router.post('/register', AuthenticationController.register);
router.put('/expiretoken', AuthenticationController.expireToken);

module.exports = router;
