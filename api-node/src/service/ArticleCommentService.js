// Utils
const common = require('./../common');
const message = require('../libs/message');
const logger = require('./LoggerService');
const {emailService} = require('./EmailService');

// Model services
const ModelService = require('./ModelService');
const UserModel = require('./../models').User;

// Services
const userService = require('./UserService');

// Models
const ArticleCommentModel = require('./../models/').ArticleComment;

class ArticleCommentService extends ModelService {
  constructor() {
    super(ArticleCommentModel, [
      {model: UserModel, as: 'user'},
    ]);
  }

  /**
   * Creates a new comment
   * @param {String} requestId
   * @param {Object} data the comment object data
   * @param {Integer} articleId the ID of the article
   * to comment against
   */
  async create(requestId, data, articleId) {
    data.articleId = articleId;
    data.createdById = userService.getCurrentUser(requestId).recuid;
    let newComment = await super.create(requestId, data);
    return this.get(requestId, newComment.recuid);
  }

  /**
   * Retrieve the replacements to be applied to the new comment email
   * @param {Object} article - article object
   * @param {Object} comment - comment object
   * @return {Object}
   */
  getEmailReplacements(article, comment) {
    return [
      {'{{recipientName}}': article.requester.name},
      {'{{createdByName}}': comment.user.name},
      {
        '{{commentsLink}}': [
          process.env.APP_URL,
          common.ui.urls['ARTICLE_COMMENTS_VIEW'].
            replace(':id', article.recuid),
        ].join(''),
      },
      {'{{comment}}': comment.comment},
      {'{{articleName}}': article.title},
      {'{{createdDate}}': comment.createdAt},
      {
        '{{themeColor}}':
          common.agency[process.env.DEFAULT_AGENT_ORG].themeColor,
      },
      {
        '{{logo}}': [process.env.APP_URL,
        common.agency[process.env.DEFAULT_AGENT_ORG].logo].join(''),
      },
      {'{{signature}}': `${process.env.APP_NAME} Team`},
    ];
  }

  /**
   * Sends a notification indicating that a new comment has been created
   * @param {Object} article - article object
   * @param {Object} comment - comment object
   */
  async sendNotification(article, comment) {
    try {
      // Define recipients
      const recipients = [
        article.accountManager.email,
        article.requester.email,
      ];

      // Send email notification
      await emailService.sendEmailTemplate(
        recipients.join(', '),
        common.email.template['NEW_COMMENT'].subject,
        common.email.template['NEW_COMMENT'].name,
        this.getEmailReplacements(article, comment)
      );
    } catch (err) {
      logger.error(`${message.get('NOTIFICATION_ERROR')}: ${err}`);
    }
  }
}

module.exports = ArticleCommentService;
module.exports.articleCommentService = new ArticleCommentService();
