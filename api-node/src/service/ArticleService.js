// Utils
const {ValidationError} = require('./../libs/APIError');
const message = require('./../libs/message');
const sequelize = require('../models').sequelize;
const common = require('./../common');

// Models
const ArticleModel = require('./../models').Article;
const ArticleTypeModel = require('./../models').ArticleType;
const UserModel = require('./../models').User;
const ArticleStatusModel = require('./../models').ArticleStatus;
const ArticleDocTypeModel = require('./../models').ArticleDocType;
const DocumentModel = require('./../models').Document;

// Services
const ModelService = require('./ModelService');
const ArticleStatusService = require('./ArticleStatusService');
const {articleStatusService} = require('./ArticleStatusService');
const {articleCommentService} = require('./ArticleCommentService');
const {userService} = require('./UserService');
const {articleDocTypeService} = require('./ArticleDocTypeService');
const {emailService} = require('./EmailService');
const {documentService} = require('./DocumentService');

/** ArticleService class */
class ArticleService extends ModelService {
  constructor() {
    let include = [
      {model: UserModel, as: 'createdBy'},
      {model: UserModel, as: 'requester'},
      {model: UserModel, as: 'accountManager'},
      {model: ArticleTypeModel, as: 'articleType'},
      {model: ArticleStatusModel, as: 'articleStatus'},
    ];
    super(ArticleModel, include);
  }

  async loadModel(requestId, transaction) {
    const user = userService.getCurrentUser(requestId);
    if (userService.isUser(user)) {
      return super.loadModel(requestId, transaction,
        {method: ['user', user.recuid]},
        {method: ['organisation', user.organisationId]},
      );
    } else if (userService.isAdmin(user)) {
      return super.loadModel(requestId, transaction);
    }
  }

  /**
   * Retrieves all article
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   */
  async all(requestId, options) {
    let articles = await super.all(requestId, options);
    let currentUser = userService.getCurrentUser(requestId);
    articles.forEach((article) => {
      let displayName = displayNameService.getArticleDisplayName(
        article, currentUser);
      article.setDataValue('displayName', displayName);
    });
    return articles;
  }

  /**
   * Retrieves a article with given id
   * @param {String} requestId
   * @param {Integer} id article id
   * @param {Object} options - sequelize properties object
   */
  async get(requestId, id, options = {}) {
    let article = await super.get(requestId, id, options);
    if (article) {
      let currentUser = userService.getCurrentUser(requestId);
      let displayName = displayNameService.getArticleDisplayName(
        article, currentUser);
      article.setDataValue('displayName', displayName);
    }
    return article;
  }

  /**
   * Adds AdContent data to an article object
   * @param {Object} article - the recuid of the requested object
   * @return {Promise} - the model with recuid=id or null if it doesn't exist
   */
  async injectAdContent(article) {
    let docs = await article.getAttachments({
      include: [
        {
          model: ArticleDocTypeModel, as: 'articleDocType',
          through: {attributes: []},
          where: {name: 'Article Content'},
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 1,
    });
    let adContent = docs.length > 0 ? docs[0] : null;
    if (adContent) {
      this.formatAdDoc(article.recuid, adContent);
    }
    article.setDataValue('adContent', adContent);
  }

  /**
   * Retrieves the article types
   * (lookup data for articleTypeId field)
   * @return {Array} data - Article types
   */
  async getArticleType() {
    return await ArticleTypeModel.findAll();
  }

  /**
   * Retrieves the article status
   * (lookup data for articleStatusId field)
   * @return {Array} data - Article status
   */
  async getArticleStatus() {
    return await articleStatusService.all();
  }

  /**
   * Retrieves the article document types
   * @return {Array<ArticleDocType>} data - Article Document types
   */
  async getDocTypes() {
    return await articleDocTypeService.all();
  }

  /**
   * Creates an article
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @return {Object} data - Article
   */
  async createAndAudit(data, requestId, options) {
    const formattedData = await this.formatCreateData(data, requestId);
    return sequelize.transaction(async (trans) => {
      let createOpts = Object.assign({transaction: trans}, options);
      let newAd = await super.createAndAudit(
        formattedData, requestId, createOpts);
      return this.get(requestId, newAd.recuid, {transaction: trans});
    });
  }

  /**
   * Prepares the data to create an article
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @return {Object} data - Data formatted
   */
  async formatCreateData(data, requestId) {
    const currentUser = userService.getCurrentUser(requestId);
    data.createdById = currentUser.recuid;
    data.requesterId = (data.requesterId) || data.createdById;

    let requester = await userService.get(requestId, data.requesterId);
    if (!this.isValidRequester(requestId, requester)) {
      throw new ValidationError(message.get('REQUESTER_NOT_FOUND'));
    }
    data.organisationId = requester.organisationId;

    // Retrieve initial account manager
    if (!data.accountManagerId) {
      const defaultAccountManager = await userService.findByEmail(
        process.env.DEFAULT_ACCOUNT_MANAGER
      );
      data.accountManagerId = defaultAccountManager.recuid;
    }

    // Retrieve initial article status
    const adStatus = await articleStatusService.getByName(
      ArticleStatusService.NEW
    );
    data.articleStatusId = adStatus.recuid;
    return data;
  }

  /**
   * Updates the status of an article
   * @param {String} requestId
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} data - the data to enter into the instance
   * @return {Promise} - resolved should contain the record that was updated
   */
  async updateStatus(requestId, id, data) {
    // Get current record
    const currentArticle = await this.get(requestId, id);

    // Get details of new status
    const newAdStatus = await articleStatusService.get(
      data.articleStatusId
    );

    // Verify if new status exists
    if (!newAdStatus) {
      throw new ValidationError(message.getAndReplace(
        'AD_STATUS_NOT_FOUND',
        data.articleStatusId
      ));
    }

    // Verify whether transition is valid or not
    const isValid = await articleStatusService.isTransitionValid(
      currentArticle.articleStatusId,
      data.articleStatusId
    );

    // Throw error if transition is not valid
    if (!isValid) {
      throw new ValidationError(message.getAndReplaceMultiple(
        'INVALID_AD_TRANSITION',
        [currentArticle.articleStatus.name, newAdStatus.name]
      ));
    }

    // Update status
    let formattedData = {articleStatusId: data.articleStatusId};
    return await this.updateAndAudit(id, formattedData, requestId);
  }

  /**
   * Gets list of all docs attached to this ad
   * @param {String} requestId
   * @param {Integer} adId - recuid of the ad
   * @return {Array<DocumentModel>} - A list of docs attached to this ad
   */
  async getAllDocs(requestId, adId) {
    let article = await super.get(requestId, adId, {
      include: [
        {
          model: UserModel, as: 'createdBy',
          attributes: ['recuid', 'name'],
        },
        {
          model: UserModel, as: 'requester',
          attributes: ['recuid', 'name'],
        },
        {
          model: DocumentModel, as: 'attachments',
          through: {attributes: []},
          include: [
            {
              model: UserModel, as: 'createdBy',
              attributes: ['recuid', 'name'],
            },
            {
              model: ArticleDocTypeModel, as: 'articleDocType',
              through: {attributes: []},
            },
          ],
        },
      ],
    });
    if (!article) {
      throw new ValidationError(message.get('RECORD_NOT_FOUND'));
    }
    article.attachments.forEach((attachment) => {
      this.formatAdDoc(article.recuid, attachment);
    });
    return article.attachments;
  }

  /**
   * Creates an attachmentInfo object for the Document controller to consume
   * @param {String} requestId
   * @param {Integer} adId - The recuid of the ad
   * @param {Integer} originalDocId - The existing id of the attachment
   * @param {Object} data - Attributes from post
   * @param {String} method - Type of method ['GET'|'CREATE'|'DELETE']
   * @param {String} host - Optional parameter that contains the API host domain
   */
  async handleDocAttachment(
    requestId, adId, originalDocId, data, method, host = false) {
    if (method === 'CREATE') {
      let docType = await articleDocTypeService.get(
        requestId, data.typeId);
      if (!docType) {
        throw new ValidationError(message.get('DOC_HAS_NO_TYPE'));
      }
    }
    let article = await this.get(requestId, adId, {
      include: [
        {model: UserModel, as: 'createdBy', attributes: ['recuid', 'name']},
        {
          model: UserModel, as: 'requester',
          attributes: ['recuid', 'name', 'email'],
        },
        {
          model: UserModel, as: 'accountManager',
          attributes: ['recuid', 'name', 'email'],
        },
        {
          model: DocumentModel, as: 'attachments',
          where: {recuid: originalDocId || null}, required: method !== 'CREATE',
        },
      ],
    });
    if (!article) {
      throw new ValidationError(message.get('RECORD_NOT_FOUND'));
    }
    let updateCallback = async (docId) => {
      if (method === 'DELETE') {
        await article.removeAttachment(originalDocId);
      } else {
        await article.addAttachment(
          docId,
          {through: {typeId: data.typeId}}
        );

        // Get doc information and generate signed url
        const doc = await documentService.get(requestId, docId);

        // Generate comment and save it
        const comment = documentService.generateFileUploadComment(
          doc.filename, data.comment);
        await articleCommentService.create(
          requestId, {comment: comment}, adId);

        // Define recipients
        const recipients = [
          article.accountManager.email,
          article.requester.email,
        ];

        let emailData = Object.assign(
          {fileName: doc.filename},
          article.dataValues
        );

        // Send email notification
        try {
          emailService.sendEmailTemplate(
            recipients.join(', '),
            common.email.template['UPLOAD_FILE'].subject,
            common.email.template['UPLOAD_FILE'].name,
            this.getEmailReplacements(emailData)
          );
        } catch (err) {
          logger.error(`${message.get('NOTIFICATION_ERROR')}: ${err}`);
        }
      }
    };
    return {
      id: originalDocId,
      parentId: adId,
      updateCallback: updateCallback,
    };
  }

  /** Update an existing instance, and return the expanded model article
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @param {Object} options - sequelize options, e.g. transaction and where
   * @return {Promise} - resolved should contain the record that was updated
   */
  async updateAndAudit(id, data, requestId, options) {
    return super.updateAndAudit(
      id, data, requestId, options).then(() => {
        return this.get(requestId, id, options);
      });
  }

  /**
   * Modifies the 'dataValue' of an attachment to add docType and a download
   * link
   * @param {Integer} articleId - The id of the article
   * @param {Model<Document>} attachment - the attachment to process, modified
   * inplace
   */
  formatAdDoc(articleId, attachment) {
    // file should only have one type so first result is popped from list
    attachment.setDataValue(
      'type',
      attachment.articleDocType.pop()
    );
    delete attachment.dataValues.articleDocType;
    attachment.setDataValue(
      'url',
      `/article/${articleId}/doc/${attachment.recuid}`
    );
  }

  /**
   * Retrieve the replacements to be applied to the upload file email
   * @param {Object} data - Collection of article/doc data to be
   * used to build the replacements object
   * @return {Object}
   */
  getEmailReplacements(data) {
    return [
      {'{{recipientName}}': data.requester.name},
      {'{{fileName}}': data.fileName},
      {
        '{{fileLink}}': [
          process.env.APP_URL,
          common.ui.urls['ARTICLE_DOCUMENTS_VIEW'].replace(':id', data.recuid),
        ].join(''),
      },
      {
        '{{articleLink}}': [
          process.env.APP_URL,
          common.ui.urls['Article_VIEW'].replace(':id', data.recuid),
        ].join(''),
      },
      {'{{articleName}}': data.displayName},
      {
        '{{themeColor}}':
          common.agency[process.env.DEFAULT_AGENT_ORG].themeColor,
      },
      {
        '{{logo}}': [process.env.APP_URL,
        common.agency[process.env.DEFAULT_AGENT_ORG].logo].join(''),
      },
      {'{{newRequester}}': data.newRequester},
      {'{{oldRequester}}': data.oldRequester},
      {'{{signature}}': `${process.env.APP_NAME} Team`},
    ];
  }

  /**
   * Add Display Name to this article.
   * @param {Object} article the current article
   * @param {Object} currentUser the current user
   * @return {String}
   */
  getDisplayName(article, currentUser) {
    let displayName = article.title;
    if (userService.isAdmin(currentUser)) {
      displayName = article.recuid + ' - ' + article.title;
    }
    return displayName;
  }


  /**
   * Checks if requester is valid given the article and current
   * user
   * @param {Number} requestId
   * @param {Object} requester - requester user object
   * @param {Object} article - Existing article object
   * @return {Boolean} True if requester is valid
   */
  isValidRequester(requestId, requester, article = null) {
    const currentUser = userService.getCurrentUser(requestId);
    if (article && article.requesterId === requester.recuid) {
      return true;
    }
    if (currentUser.recuid === requester.recuid) {
      return true;
    }
    if (!userService.isUser(currentUser)) {
      return true;
    }
    if (currentUser.organisationId === requester.organisationId) {
      return true;
    }
    return false;
  }
}

module.exports = ArticleService;
module.exports.articleService = new ArticleService();
