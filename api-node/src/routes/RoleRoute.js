const express = require('express');
const router = express.Router();
const RoleController
  = require('./../controllers/RoleController');

// Role routes
router.get('', RoleController.all);

module.exports = router;
