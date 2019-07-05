const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const common = require('../../common');
const {InternalError} = require('../../libs/APIError');
const message = require('../../libs/message');
const nodemailer = require('nodemailer');
const StringService = require('../StringService');
const AmazonSecretService = require('./../AmazonSecretService');
const logger = require('./../LoggerService');

const readFileAsync = promisify(fs.readFile);

class EmailService {
  // Definition of the transporter object used to send notifications
  constructor() {
    this.stringService = new StringService();
    this.emailEnabled = process.env.EMAIL_ENABLED === 'true';
    this.emailFrom = process.env.EMAIL_FROM;
    this.transporter = null;
  }

  /**
   * Initializse the transporter object used to send notifications
   */
  async init() {
    if (!this.transporter && !AmazonSecretService.isCacheReset()) {
      const emailParams = await AmazonSecretService.getSecret(
        common.email.awsSecret.prefix);
      const host = emailParams[common.email.awsSecret.host];
      const port = parseInt(emailParams[common.email.awsSecret.port]);
      const secure = emailParams[common.email.awsSecret.secure] === 'true';
      const user = emailParams[common.email.awsSecret.user];
      const pass = emailParams[common.email.awsSecret.password];
      logger.info(
        `EmailService. Initializing email nodemailer. host=${host}:${port}`);
      this.transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
          user: user,
          pass: pass,
        },
      });
    }
  }

  /**
   * Sends an email to the given recipient
   * @param {Object} recipient the user, or list of users, to send the email to
   * @param {String} subject the subject of the email
   * @param {String} content the HTML content of the email
   * @param {Object} attachments (optional) additional attachments to the email
   */
  async sendEmail(recipient, subject, content, attachments) {
    // Condition to bypass notification
    if (!this.emailEnabled) return true;
    await this.init();
    const options = {
      from: this.emailFrom,
      to: recipient,
      subject: subject,
      html: content,
    };

    // Apply attachments when available
    if (attachments) options.attachments = attachments;
    return this.transporter.sendMail(options);
  }

  /**
   * Searches table email_template, and applies replacements to the column
   * "content".
   * Uses {@link EmailTemplateModel} to find email templates.
   * Uses {@link StringService#replace} to apply the replacements.
   *
   * @param {String} templateName - the name of the template
   * @param {Array} replacements - an array or template replacements
   * @return {String} the value of column "content", with replacements applied.
   */
  async fillEmailTemplate(templateName, replacements) {
    try {
      let templateData = await this.getTemplate(templateName);
      if (templateData) {
        return this.stringService.replace(templateData, replacements);
      } else {
        throw new InternalError(
          message.getAndReplace('EMAIL_TEMPLATE_NOT_FOUND', template)
        );
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sends an email to a given recipient, using
   * the given template and replacements
   * @param {Object} recipient the user, or list of users, to send the email to
   * @param {String} subject the subject of the email
   * @param {String} templateName - the name of the template
   * @param {Array} replacements - an array or template replacements
   * @param {Object} attachments (optional) additional attachments to the email
   */
  async sendEmailTemplate(
    recipient, subject, templateName, replacements, attachments
  ) {
    let content = await this.fillEmailTemplate(
      templateName, replacements, attachments
    );
    return await this.sendEmail(recipient, subject, content);
  }

  async getTemplate(templateName) {
    return this.getTemplateFromFile(templateName);
  }

  async getTemplateFromFile(templateName) {
    try {
      let tmplPath = path.join(__dirname, 'templates', `${templateName}.html`);
      return readFileAsync(tmplPath, 'utf8');
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EmailService;
module.exports.emailService = new EmailService();
