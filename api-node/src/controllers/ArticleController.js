// Utils
const {ValidationError} = require('../libs/APIError');

const ArticleService = require('./../service/ArticleService');
const AuditLogService = require('../service/AuditLogService');
const CommentService = require('./../service/ArticleCommentService');
const message = require('../libs/message');
const common = require('../common');

const articleService = new ArticleService();
const auditLogService = new AuditLogService();
const commentService = new CommentService();

/** Article controller */
class Article {
  /**
   * Get all articles handler
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  all(req, res, next) {
    articleService.all(req.requestId).then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  }

  /**
   * Get individual Article object
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  get(req, res, next) {
    articleService.get(
      req.requestId,
      req.params.id
    ).then(async (article) => {
      if (article !== null) {
        await articleService.injectAdContent(article);
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('GET_RECORD'),
          data: article,
        });
      } else {
        res.status(common.statusCode['NOT_FOUND']).json({
          message: message.get('RECORD_NOT_FOUND'),
          data: article,
        });
      }
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Get a list of comments related to this article
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getComments(req, res, next) {
    let options = {where: {articleId: req.params.id}};
    commentService.all(req.requestId, options).then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Add a comment to an existing article
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  addComment(req, res, next) {
    articleService.get(req.requestId, req.params.id)
    .then((articleRecord) => {
      // Check if article exists
      if (!articleRecord) {
        res.status(common.statusCode['NOT_FOUND']).json({
          message: message.get('RECORD_NOT_FOUND'),
          data: req.body,
        });
        throw new ValidationError(message.get('RECORD_NOT_FOUND'));
      }
      commentService.create(
        req.requestId,
        req.body,
        req.params.id
      ).then((data) => {
        commentService.sendNotification(articleRecord, data);
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('POST_RECORD'),
          data: data,
        });
      }).catch((error) => {
        next(error);
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * create a new Article object
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  create(req, res, next) {
    articleService.createAndAudit(
      req.body,
      req.requestId,
      {}
    ).then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('POST_RECORD'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * update an existing Article object
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  update(req, res, next) {
    articleService.updateAndAudit(
      req.params.id, req.body, req.requestId)
      .then((data) => {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('PUT_RECORD'),
          data: data,
        });
      }).catch((error) => {
        next(error);
      });
  };

  /**
   * delete an existing Article object
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  delete(req, res, next) {
    articleService.deleteAndAudit(
      req.params.id, req.requestId)
      .then((data) => {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('DELETE_RECORD'),
        });
      }).catch((error) => {
        next(error);
      });
  };

  /**
   * Get a list of auditLogs related to this article.
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getAuditLogs(req, res, next) {
    const objectType = common.audit.parentType;
    const objectId = req.params.id;
    auditLogService.getByTypeFormatted(objectType, objectId).then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Get article types
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getArticleType(req, res, next) {
    articleService.getArticleType().then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  }

  /**
   * Get article status
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getArticleStatus(req, res, next) {
    articleService.getArticleStatus().then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  }

  /**
   * Get article document types
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getDocTypes(req, res, next) {
    articleService.getDocTypes().then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_ALL_RECORDS'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  }

  /**
   * Update the status of an existing article
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  updateStatus(req, res, next) {
    articleService.updateStatus(req.requestId, req.params.id, req.body)
    .then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('PUT_RECORD'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Gets the list of documents attached to this ad
   * id field of ad should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  async getAllDocs(req, res, next) {
    articleService.getAllDocs(req.requestId, req.params.id)
    .then((data) => {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_RECORD'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Middlewear for creating an doc for this ad
   * id field of ad should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  async createDoc(req, res, next) {
    try {
      req.attachmentInfo =
        await articleService.handleDocAttachment(
          req.requestId,
          req.params.id,
          req.params.docId,
          req.body,
          'CREATE',
          req.getHost(),
        );
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Middlewear for getting an doc for this ad
   * id and docIc field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  async getDoc(req, res, next) {
    try {
      req.attachmentInfo =
        await articleService.handleDocAttachment(
          req.requestId,
          req.params.id,
          req.params.docId,
          req.body,
          'GET'
        );
      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Middlewear for deleting an doc for this ad
   * id and docIc field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  async deleteDoc(req, res, next) {
    try {
      req.attachmentInfo =
        await articleService.handleDocAttachment(
          req.requestId,
          req.params.id,
          req.params.docId,
          req.body,
          'DELETE'
        );
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new Article();
