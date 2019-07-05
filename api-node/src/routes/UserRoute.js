const express = require('express');
const router = express.Router();
const userController = require('./../controllers/UserController');

// User routes
router.get('/', userController.all);
router.post('/filter', userController.all);
router.get('/me', userController.getMe);
router.get('/:id(\\d+)', userController.get);
router.put('/:id(\\d+)', userController.update);
router.delete('/:email', userController.delete);
router.post('/enable/:email', userController.enable);
module.exports = router;
