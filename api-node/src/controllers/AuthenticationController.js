const qs = require('querystring');
const message = require('./../libs/message');
const common = require('./../common');
const {InternalError} = require('./../libs/APIError');
const {userService} = require('../service/UserService');
const {authenticationService} = require('../service/AuthenticationService');


/** Authentication controller */
class AuthenticationController {
  /**
   * Perform a login
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  login(req, res, next) {
    authenticationService.login(req.body.username, req.body.password)
    .then((token) => {
      if (!token) {
        throw new InternalError(message.get('LOGIN_FAILED'));
      }
      // Add header
      res.set(common.header.AUTHTOKEN, token);
      res.status(common.statusCode.SUCCESS);
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Perform a logout
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  logout(req, res, next) {
    try {
      const params = qs.stringify({
        app: process.env.APP_NAME,
      });
      const redirectUrl =
        process.env.APP_URL+process.env.APP_URL_PATH_LOGIN+'?'+params;
      if (!req.requestId) {
        throw new InternalError(message.get('LOGOUT_FAILED'));
      }
      const user = userService.getCurrentUser(req.requestId);
      authenticationService.expireToken(user);
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    };
  };

  /**
   * Register a user
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  register(req, res, next) {
    let options = {};
    authenticationService.createUser(req.body, options).then((url) => {
      if (url !== null) {
        res.redirect(url);
      } else {
        throw new InternalError(message.get('LOGOUT_FAILED'));
      }
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Expires a user token
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  expireToken(req, res, next) {
    if (process.env.AUTH_ENABLED === 'false') {
      res.status(common.statusCode['SUCCESS']).json({
        message: message.get('PUT_RECORD'),
        data: null,
      });
    } else {
      authenticationService.expireToken(req.body)
      .then((data) => {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('PUT_RECORD'),
          data: data,
        });
      })
      .catch((error) => {
        next(error);
      });
    }
  }
}

module.exports = new AuthenticationController();
