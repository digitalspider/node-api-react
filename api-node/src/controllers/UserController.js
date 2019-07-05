const UserService = require('./../service/UserService');
const common = require('./../common');
const message = require('./../libs/message');
const Util = require('./../libs/Util');
const userService = new UserService();

/** User controller */
class User {
  /**
   * Get all users
   * Optional Sequelize options object in body
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  all(req, res, next) {
    let filters = Util.parseFilter(req.body);
    if (filters && filters.where && filters.where.token) {
      delete filters.where.token;
    }
    userService
      .all(req.requestId, filters)
      .then((data) => {
        res
          .status(common.statusCode['SUCCESS'])
          .json({message: message.get('GET_ALL_RECORDS'), data: data});
      })
      .catch((error) => {
        next(error);
      });
  }

  /**
   * Get current user data object
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  getMe(req, res, next) {
    let options = {
      attributes: {
        include: ['token'],
        exclude: ['password', 'guid'],
      },
    };
    const currentUser = userService.getCurrentUser(req.requestId);
    userService.get(req.requestId, currentUser.recuid, options).then((data) => {
      if (data !== null) {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('GET_RECORD'),
          data: data,
        });
      } else {
        res.status(common.statusCode['NOT_FOUND']).json({
          message: message.get('RECORD_NOT_FOUND'),
          data: data,
        });
      }
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Get individual user object
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  get(req, res, next) {
    userService.get(req.requestId, req.params.id).then((data) => {
      if (data !== null) {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('GET_RECORD'),
          data: data,
        });
      } else {
        res.status(common.statusCode['NOT_FOUND']).json({
          message: message.get('RECORD_NOT_FOUND'),
          data: data,
        });
      }
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Update the user role
   * id field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  update(req, res, next) {
    userService.updateRole(
      Number(req.params.id),
      req.body,
      req.requestId
    ).then((data) => {
      if (data !== null) {
        res.status(common.statusCode['SUCCESS']).json({
          message: message.get('PUT_RECORD'),
          data: data,
        });
      } else {
        res.status(common.statusCode['NOT_FOUND']).json({
          message: message.get('RECORD_NOT_FOUND'),
          data: data,
        });
      }
    }).catch((error) => {
      next(error);
    });
  };

  /**
   * Enable the user
   * email field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  enable(req, res, next) {
    userService.enableUser(
      req.requestId,
      req.params.email
    ).then((data) => {
      res
        .status(common.statusCode['SUCCESS'])
        .json({message: message.get('POST_RECORD'), data: data});
    })
    .catch((error) => {
      next(error);
    });
  }

  /**
   * Delete the user
   * email field should be in request parameters
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  delete(req, res, next) {
    userService.deleteUser(
      req.requestId,
      req.params.email
    ).then((data) => {
      res
        .status(common.statusCode['SUCCESS'])
        .json({message: message.get('DELETE_RECORD'), data: data});
    })
    .catch((error) => {
      next(error);
    });
  }
}

module.exports = new User();
