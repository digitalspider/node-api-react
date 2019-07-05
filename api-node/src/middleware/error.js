const common = require('../common');
const validator = require('../libs/validator');
const message = require('../libs/message');
const Datetime = require('../libs/Datetime');
const logger = require('../service/LoggerService');
const {userService} = require('../service/UserService');
const uuidv4 = require('uuid/v4');

// @todo: jsdoc
module.exports = (error, req, res, next) => {
  // Register the error in the log
  const datetime = new Datetime();
  const timestamp = datetime.get('DATETIME_DB');
  const errorId = uuidv4();
  const user = req.requestId ? userService.getCurrentUser(req.requestId) : {};
  const errorObject = {
    timestamp: timestamp,
    type: 'ERROR',
    app: process.env.APP_NAME,
    error: error,
    request: {
      headers: req.headers,
      url: req.url,
      method: req.method,
    },
    user: user,
    errorId: errorId,
  };
  console.error(errorObject);
  logger.error(errorObject);

  // If errors are sent from sequelize, then the errors should be forrmatted
  if (validator.isSequelizeError(error.name)) {
    error.data = validator.formatSequelizeErrors(error);
    error.message = message.get('SEQUELIZE_ERROR');
  }

  let errorData = [];
  if (error.data) {
    if (Array.isArray(error.data)) {
      errorData = error.data;
    } else {
      errorData.push(error.data);
    }
  } else {
    errorData.push(error.toString());
  }
  res.status(error.status || 500);
  res.set(common.header.ERROR_ID, errorId).json({
    message: error.message || message.get('INTERNAL_ERROR'),
    data: errorData,
    errorId: errorId,
  });
};
