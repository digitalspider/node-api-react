const ArticleStatusModel = require('./../models').ArticleStatus;
const ArticleStatusTransitionModel =
require('./../models').ArticleStatusTransition;
const ModelService = require('./ModelService');

/** Article Status Service class */
class ArticleStatusService extends ModelService {
  constructor() {
    super(ArticleStatusModel);
  }

  /**
   * Retrieves an article status, given the advetisement status name
   * @param {String} name - Name of the article
   * @param {object} transaction - db transaction to use (not compulsory)
   * @return {Object} - Article Status object
   */
  async getByName(name, {transaction}) {
    let options = {
      where: {name: name},
    };
    if (transaction) {
      options.transaction = transaction;
    }
    return await this.model.findOne(options);
  }

  /**
   * Verifies whether a transition between status is valid or not
   * @param {Integer} fromStatusId - The current status
   * @param {Integer} toStatusId - The status to be change to
   * @return {Boolean} - true if transition is valid. Otherwise, false
   */
  async isTransitionValid(fromStatusId, toStatusId) {
    let result = await ArticleStatusTransitionModel
      .findOne({
        where: {
          fromStatusId: fromStatusId,
          toStatusId: toStatusId,
        },
      });
      return (result);
  }
}

// Defining static props
ArticleStatusService.NEW = 'New';
ArticleStatusService.IN_PROGRESS='In Progress';
ArticleStatusService.AWAITING_APPROVAL = 'Awaiting Approval';
ArticleStatusService.CHANGES_REQUIRED = 'Changes Required';
ArticleStatusService.COMPLETED='Completed';
ArticleStatusService.CANCELLED = 'Cancelled';

module.exports = ArticleStatusService;
module.exports.articleStatusService = new ArticleStatusService();
