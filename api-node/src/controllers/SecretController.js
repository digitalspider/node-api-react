const AmazonSecretService = require('../service/AmazonSecretService');
const message = require('../libs/message');
const common = require('../common');

/** Secret controller */
class SecretController {
  /**
   * reset the cache, with the give param 'name'
   * name field may be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  reset(req, res, next) {
    try {
      let data = AmazonSecretService.clearSecretsFromCache(req.params.name);
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('GET_RECORD'),
        data: data,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new SecretController();
