const uuidv4 = require('uuid/v4');
const common = require('../common');
const message = require('../libs/message');
const DateTime = require('../libs/Datetime');
const {
  UnauthorizedError,
  ValidationError,
  APIError,
} = require('../libs/APIError');
const UserModel = require('./../models').User;
const RoleModel = require('./../models').Role;
const {Sequelize} = require('../models');
const ModelService = require('./ModelService');
const {requestService} = require('./RequestService');
const RoleService = require('./RoleService');
const {roleService} = require('./RoleService');

/** User Service class */
class UserService extends ModelService {
  constructor() {
    super(UserModel, [
      {model: RoleModel, as: 'roles', through: {attributes: []}},
    ]);
  }

  /**
   * Generates a new user token and resets the expiry date of it
   * @param {Integer} recuid - id of the user record
   * @param {Object} transaction - db transaction to use (not compulsory)
   * @return {String} - User token
   */
  async renewUserToken(recuid, transaction) {
    let now = new DateTime();
    let expireTime = new DateTime().add(7, 'days');
    let data = {
      token: uuidv4(),
      lastVisit: now.get('DATETIME_DB'),
      tokenExpiryDate: expireTime.get('DATETIME_DB'),
    };
    let options = transaction ? {transaction: transaction} : {};
    await this.update(null, recuid, data, options);
    return data.token;
  }

  /**
   * Gets list of requestors
   * @param {String} requestId
   * @return {Promise<Array>}
   */
  async getRequesters(requestId) {
    let options = {
      where: {'$roles.name$': common.roles.USER},
    };
    return this.all(requestId, options);
  }

  /**
   * Create a new user, and assigns them to the given role
   * @param {Object} data - User data to create
   * @param {Object} options - sequelize options (not compulsory)
   * @return {Object} data - user record created
   */
  async createUser(data, options) {
    // created by
    // Get sysAdminUser information
    // const sysAdminUser = await this.getSysAdminUser(transaction);
    return this.create(null, data, options).then(async (user) => {
      let role = await roleService.getByName(
        RoleService.ROLE_USER, options) || {};
      if (role) {
        user.addRole(role.recuid, options);
      }
      return user;
    });
  }


  /**
   * Delete a user
   * @param {String} requestId
   * @param {String} email - email address of the user
   * @param {Object} transaction - sequelize transaction, optional
   * @return {User} the value returned by sequelize destroy()
   */
  async deleteUser(requestId, email, transaction) {
    // Can't delete yourself
    let currentUser = this.getCurrentUser(requestId);
    if (currentUser.email === email) {
      throw new APIError(
        message.get('INVALID_DELETE_SELF'),
        common.statusCode['NOT_ALLOWED'],
      );
    }
    let params = {};
    if (transaction) {
      params.transaction = transaction;
    }
    let user = await this.findByEmail(email, transaction);
    if (!user) {
      throw new APIError(
        message.get('RECORD_NOT_FOUND'),
        common.statusCode['VALIDATION_ERROR'],
      );
    }
    // Can only delete some users
    if (!this.isUser(user) || process.env.SYSADMIN_USERNAME === user.username) {
      throw new APIError(
        message.get('INVALID_DELETE_USER_DENIED'),
        common.statusCode['NOT_ALLOWED'],
      );
    }
    return await user.destroy(params);
  }

  /**
   * Enable a user
   * @param {String} username - username of the user
   * @param {String} password - password of the user
   * @param {Object} transaction - sequelize transaction, optional
   * @return {User} the value returned by sequelize find()
   */
  async authenticate(username, password, {transaction}) {
    let options = {
      where: {
        username: username,
        password: password,
      },
      include: this.defaultOpts.include,
    };
    if (transaction) {
      options.transaction = transaction;
    }
    let user = await this.model.findOne(options);
    if (!user) {
      throw new ValidationError(message.getAndReplace(
        'INVALID_USERNAME_PASSWORD',
        username
      ));
    }
    return user;
  }

  /**
   * Enable a user
   * @param {String} requestId
   * @param {String} email - email address of the user
   * @param {Object} transaction - sequelize transaction
   * @return {User} the value returned by sequelize restore()
   */
  async enableUser(requestId, email, transaction) {
    // Can't enable yourself
    let currentUser = this.getCurrentUser(requestId);
    if (currentUser.email === email) {
      throw new APIError(
        message.get('INVALID_ENABLE_SELF_DENIED'),
        common.statusCode['NOT_ALLOWED'],
      );
    }
    let params = {paranoid: false};
    if (transaction) {
      params.transaction = transaction;
    }
    let user = await this.findByEmail(email, transaction, true);
    if (!user) {
      throw new APIError(
        message.get('RECORD_NOT_FOUND'),
        common.statusCode['VALIDATION_ERROR'],
      );
    }
    return await user.restore(params);
  }

  /**
   * Update an existing user, and assigns them to the given role
   * @param {Integer} userId - The user to modify
   * @param {Object} data - User data to update
   * @param {String} requestId
   * @return {Object} data - user record created
   */
  async updateRole(userId, data, requestId) {
    let options = {
      include: [
        {model: RoleModel, as: 'roles', through: {attributes: []}},
      ],
    };
    let user = await this.get(requestId, userId, options);
    if (user) {
      const currentUser = this.getCurrentUser(requestId);
      if (userId === currentUser.recuid) {
        user.setRoles([data.roleId] || user.roles);
      } else {
        throw new UnauthorizedError(message.get('REQUEST_UNAUTHORIZED'));
      }
    }
    return user;
  }

  /**
   * Retrieves the details of the sysAdmin user
   * This created as part of the setup process of the myapp project
   * @param {object} transaction - db transaction to use (not compulsory)
   * @return {Object} data - Data of the sysAdmin user
   */
  async getSysAdminUser(transaction) {
    const options = {
      include: [{model: RoleModel, as: 'roles'}],
      where: {
        username: process.env.SYSADMIN_USERNAME,
      },
    };
    if (transaction) {
      options.transaction = transaction;
    }
    return this.model.findOne(options);
  }

  /**
   * Retrieves the details of a user by searching for an email address
   * @param {String} email - the email address to search for
   * @param {Object} transaction - db transaction to use (not compulsory)
   * @param {Boolean} findDeleted - if true find using paranoid, default=false
   * @return {Object} data - Data of the user found
   */
  async findByEmail(email, transaction, findDeleted=false) {
    let params = {
      where: {email: email},
      include: this.defaultOpts.include,
      paranoid: !findDeleted,
    };
    if (transaction) {
      params.transaction = transaction;
    }
    return this.model.findOne(params);
  }

  /**
   * Verifies whether a user token is valid or not.
   * @param {String} token - The token to be verified
   * @return {Object} user - If valid, the function returns
   * the user object. Otherwise it returns falsy
   */
  async verifyToken(token) {
    // Verify if token exists
    if (!token) {
      return false;
    }
    const options = {
      where: {
        token: token,
        tokenExpiryDate: {
          [Sequelize.Op.gte]: Sequelize.fn('NOW'),
        },
      },
    };
    // Verify user token and retrieve user
    return await this.findOne(null, options);
  }

  // override unneeded modelservice functions
  // @todo: throw error?
  delete() {};

  /**
   * Get the user from the {@link RequestService#getKey}.
   * This user should have been set by the auth.js middleware.
   * @param {String} requestId the unique id of this request
   * @return {User} the currentUser in this request
   */
  getCurrentUser(requestId) {
    return requestService.getKey(requestId, 'currentUser');
  }

  /**
   * Get all the role.recuid's for this user
   * @param {User} user the user
   * @return {Array} an array or role.recuid's
   */
  getUserRoleIds(user) {
    return user.roles.map((role) => role.recuid);
  }

  /**
   * Verifies whether the current user has the role admin or not.
   * @param {Object} user
   * @return {Boolean} - true if the user is admin. Otherwise false.
   */
  isAdmin(user) {
    return user.roles.some((role) => {
      return role.name === RoleService.ROLE_ADMIN;
    });
  }

  /**
   * Verifies whether the current user has the role 'user' or not.
   * @param {Object} user
   * @return {Boolean} - true if the user has 'user' role. Otherwise false.
   */
  isUser(user) {
    return user.roles.some((role) => {
      return role.name === RoleService.ROLE_USER;
    });
  }
}

module.exports = UserService;
module.exports.userService = new UserService();
