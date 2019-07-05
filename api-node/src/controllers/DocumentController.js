const DocumentService = require('./../service/DocumentService');
const message = require('./../libs/message');
const common = require('./../common');

const documentService = new DocumentService();
/** Document controller */
class Document {
  /**
   * Download a document
   * token should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  download(req, res, next) {
    documentService.downloadFile(req.params.token).then((documentData) => {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + documentData.name
      );
      res.end(documentData.body);
    }).catch((err) => {
      next(err);
    });
  }

  /**
   * Get the signed url of a file.
   * The url returned is meant to be used to download the file
   * attachmentInfo object should be added to the request
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  async getSignedUrl(req, res, next) {
    documentService.getSignedUrl(
      req.attachmentInfo.id,
      req.requestId
    ).then(async (data) => {
      await documentService.auditDownload(
        data.token, req.attachmentInfo.parentId, req.requestId);
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_RECORD'),
        data: data.url,
      });
    }).catch((error) => {
      next(error);
    });
  }

  /**
   * upload document
   * attachmentInfo object should be added to the request
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  upload(req, res, next) {
    documentService.uploadFile(
      req.file,
      req.body.comment,
      req.attachmentInfo.orgCode,
      req.attachmentInfo.parentId,
      req.requestId
    ).then(async (data) => {
      await req.attachmentInfo.updateCallback(data.recuid);
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('POST_RECORD'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Delete a document
   * attachmentInfo object should be added to the request
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  delete(req, res, next) {
    documentService.deleteAndAudit(req.attachmentInfo.id, req.requestId, {},
      req.attachmentInfo.parentId)
    .then(async (data) => {
      await req.attachmentInfo.updateCallback(null);
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('DELETE_RECORD'),
        data: data,
      });
    }).catch((error) => {
      next(error);
    });
  };
}

module.exports = new Document();
