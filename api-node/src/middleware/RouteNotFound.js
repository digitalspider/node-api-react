const {APIError} = require('../libs/APIError');
const message = require('./../libs/message');

// Route not found implementation
module.exports = (req, res, next) => {
  // @todo: fix message
  const error = new APIError(message.get('ROUTE_NOT_FOUND'));
  next(error);
};
