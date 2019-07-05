// Utils
const {ValidationError} = require('../libs/APIError');
const common = require('../common');
const message = require('../libs/message');
const Datetime = require('../libs/Datetime');
const md5 = require('md5');

// Models
const DocumentModel = require('./../models').Document;
const DocumentPermissionModel = require('./../models').DocumentPermission;
const UserModel = require('./../models').User;
const {sequelize} = require('./../models');

// Services
const ModelService = require('./ModelService');
const AuditLogService = require('./AuditLogService');
const amazons3 = require('./../service/AmazonS3Service');
const auditLogService = new AuditLogService();
const userService = require('./UserService');

const S3PREFIX = 'DOCS';

/** Document Service class */
class DocumentService extends ModelService {
  constructor() {
    super(DocumentModel);
  }

  /**
   * Gets the signed url to download this document at
   * Creates a documentPermission entry and generates a token for the doc
   * @param {Integer} docId - the Id of the document requested
   * @param {String} requestId
   * @return {String} - the signed url to download this document at
   */
  async getSignedUrl(docId, requestId) {
    if (!docId) {
      throw new ValidationError(message.getAndReplace('ATTACHMENT_MISSING'));
    }
    let expiresAt = new Datetime();
    // Prepare data to be saved
    let newDocPerm = {
      expiryDate: expiresAt.get('DATE_DB'),
      token: md5([
        docId,
        userService.getCurrentUser(requestId).recuid,
        expiresAt.get('MILLISECOND_TIMESTAMP'),
      ].join('')),
    };
    await sequelize.transaction(async (trans) => {
      let currentUser = userService.getCurrentUser(requestId);
      await currentUser.removeDocumentPermission(docId, {
        transaction: trans,
      });
      await currentUser.addDocumentPermission([docId], {
        through: newDocPerm,
        transaction: trans,
      });
    });

    // Return encoded
    return {token: newDocPerm.token,
      url: common.document.signedURLFormat
              .replace('{token}', newDocPerm.token)};
  }

  /**
   * Gets body and filename of the document associated with this token
   * @param {String} token - A string representing a token in the docPerm table
   * @return {Object} - Object containing file body and filename under the keys
   * 'body' and 'name' respectively
   */
  async downloadFile(token) {
    let document = await this.getDocument(token);
    let docData = await amazons3.get(document.s3Key, document.s3Version);
    return {
      name: document.filename,
      body: docData.Body,
    };
  }

  async getDocument(token) {
    let document = await this.findByToken(token);
    if (!document) {
      throw new ValidationError(message.get('RECORD_NOT_FOUND_OR_PERMITTED'));
    }
    return document;
  }

  /**
   * Retrieves a document that matches the token in the docPem table
   * @param {String} token - Token to match against
   * @return {Object} - Document object
   */
  async findByToken(token) {
    let options = {
      include: [{
        model: UserModel, as: 'documentPermissions', attributes: [],
        required: true, through: {
          where: {token: token},
        },
      }],
    };
    return this.findOne(null, options);
  }

  /**
   * Uploads a file to s3 and records metadata to db
   * @param {Blob} file - The file data
   * @param {String} comment - Comment to attach to file
   * @param {String} orgCode - Three letter Org code of the file
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @param {String} requestId
   * @param {Object} options - optional options object, can contain transaction
   * @return {Object} - The record of the uploaded file
   */
  async uploadFile(file, comment, orgCode, parentId, requestId, options) {
    if (!file) {
      throw new ValidationError(message.get('FILE_UNDEFINED'));
    }
    let currentUser = userService.getCurrentUser(requestId);
    let data = {
      filename: file.originalname,
      createdById: currentUser.recuid,
      comment: comment || null,
      s3Key: '',
      s3Version: '',
    };

    return sequelize.transaction(async (trans) => {
      let uploadOpts = {transaction: trans};
      let newDoc = await this.createAndAudit(
        data, requestId, Object.assign(uploadOpts, options), parentId);

      let s3Key = `${S3PREFIX}/${orgCode}/${newDoc.recuid}`;

      let metadata = {
        'filename': file.originalname,
        'comment': comment || '',
        'createdbyid': `${currentUser.recuid}`,
        'createdbyemail': `${currentUser.email}`,
      };
      let uploadedDoc = await amazons3.save(file.path, s3Key, metadata);

      await newDoc.update({
        s3Key: uploadedDoc.Key,
        s3Version: uploadedDoc.VersionId,
      }, uploadOpts);
      return newDoc;
    });
  }

  /** delete an existing document
   * @param {String} requestId
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} options - sequelize properties object
   * @return {Promise}
   */
  async delete(requestId, id, options = {}) {
    return sequelize.transaction(async (trans) => {
      await DocumentPermissionModel.destroy({
        where: {documentId: id},
        transaction: trans,
      });
      return await super.delete(requestId, id, options);
    });
  }

  /**
   * Create an AuditLog when the user downloads a file
   * @param {String} token - method by which to get a document
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @param {String} requestId
   */
  async auditDownload(token, parentId, requestId) {
    const document = await this.getDocument(token);
    const userId = userService.getCurrentUser(requestId).recuid;
    const data = {
      filename: document.filename,
      createdById: userId,
    };
    const auditOptions = {};
    await auditLogService.registerDownload(userId, this.model,
      document.recuid, data, auditOptions, parentId);
  }

  /**
   * Generates a default comment for a file that is uploaded
   * @param {String} fileName - Name of the uploaded file
   * @param {String} comment - Wording to be included in the comment
   * @return {String} The content of the comment (in HTML)
   */
  generateFileUploadComment(fileName, comment) {
    return `<p><em><strong>File uploaded</strong>: ${fileName}</em></p>` +
      (comment || '');
  }
}
module.exports = DocumentService;
module.exports.documentService = new DocumentService();
