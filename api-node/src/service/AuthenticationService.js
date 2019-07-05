const {ValidationError} = require('./../libs/APIError');
const DateTime = require('./../libs/Datetime');
const message = require('./../libs/message');
const {userService} = require('../service/UserService');
const sequelize = require('./../models').sequelize;

class AuthenticationService {
  /**
   * Verifies if the username and password provided are valid.
   * @param {String} username - The username attempting to login
   * @param {String} password - The password attempting to login
   */
  async login(username, password) {
    return sequelize.transaction(async function(transaction) {
      let options = {transaction};
      // Get user information
      const user = await userService.authenticate(username, password, options);
      // Renew the user token, and return the token
      return userService.renewUserToken(user.recuid, options);
    });
  }

  /**
   * The function verifies if the user exists. If so, it updates
   * him, otherwise, it creates him, and assigns him a role, depending
   * on the agency that the user works in.
   * @param {Object} data - User data
   * @param {object} transaction - db transaction to use (not compulsory)
   * @return {Object} The user created
   */
  async createUser(data, {transaction}) {
    // Verify if user already exists in the database
    const username = data.username;
    const password = data.password;
    const email = data.email;
    if (!username) {
      throw new ValidationError(
        message.getAndReplace('FIELD_REQUIRED', 'username'));
    }
    if (!password) {
      throw new ValidationError(
        message.getAndReplace('FIELD_REQUIRED', 'password'));
    }
    if (!email) {
      throw new ValidationError(
        message.getAndReplace('FIELD_REQUIRED', 'email'));
    }
    let user = await userService.model.findOne({
      where: {username: username},
      transaction: transaction,
    });
    if (user) {
      throw new ValidationError(
        message.getAndReplace('INVALID_NEW_FIELD', 'username'));
    }
    user = await userService.model.findOne({
      where: {email: email},
      transaction: transaction,
    });
    if (user) {
      throw new ValidationError(
        message.getAndReplace('INVALID_NEW_FIELD', 'email'));
    }
    let options = transaction ? {transaction} : {};
    user = await userService.createUser(data, options);
    userService.renewUserToken(user.recuid, options);
    return await userService.model.findOne({
      where: {username: username},
      transaction: transaction,
    });
  }

  /**
   * Expires a user token
   * @param {Object} token - object that contains the user token
   * @return {Object} Promise
   */
  async expireToken({token}) {
    if (!token) {
      throw new ValidationError(message.getAndReplace(
        'FIELD_REQUIRED',
        'token'
      ));
    }
    const datetime = new DateTime('1970-01-01');
    const formattedData = {
      token: '',
      tokenExpiryDate: datetime.get('DATETIME_DB'),
    };
    const options = {
      where: {token: data.token},
    };
    return await userService.model.update(formattedData, options);
  }
}

module.exports = AuthenticationService;
module.exports.authenticationService = new AuthenticationService();

