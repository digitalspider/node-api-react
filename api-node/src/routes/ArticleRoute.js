const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentController');
const articleController =
  require('./../controllers/ArticleController');

// Article document routes
router.get(
  '/:id(\\d+)/doc',
  articleController.getAllDocs
);
router.post(
  '/:id(\\d+)/doc',
  articleController.createDoc, documentController.upload
);
router.get(
  '/:id(\\d+)/doc/:docId(\\d+)',
  articleController.getDoc, documentController.getSignedUrl
);
router.delete(
  '/:id(\\d+)/doc/:docId(\\d+)',
  articleController.deleteDoc, documentController.delete
);

// Article routes
router.get('/', articleController.all);
router.get('/:id(\\d+)', articleController.get);
router.get('/:id(\\d+)/history', articleController.getAuditLogs);
router.get('/:id(\\d+)/comment', articleController.getComments);
router.post('/:id(\\d+)/comment', articleController.addComment);
router.put('/:id(\\d+)', articleController.update);
router.put('/:id(\\d+)/status', articleController.updateStatus);
// @NOTE: Temporarily removed as it's currently not needed and has caused issues
// router.delete('/:id(\\d+)', articleController.delete);
router.post('/', articleController.create);

// Lookup routes
router.get('/type', articleController.getArticleType);
router.get('/status', articleController.getArticleStatus);
router.get('/doctype', articleController.getDocTypes);

module.exports = router;
