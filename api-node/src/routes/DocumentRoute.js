const express = require('express');
const router = express.Router();
const documentController =
  require('../controllers/DocumentController');

// Document Routes to be used after access through another object
// Other object should add an 'attachmentInfo' object to the request
// Get an signedUrl for a doc
router.get('/', documentController.getSignedUrl);

// delete a doc
router.delete('/', documentController.delete);

// Upload doc
router.post(
  '/',
  documentController.upload
);


module.exports = router;
