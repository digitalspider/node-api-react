const common = require('./../common');
const message = require('./../libs/message');

class APIError extends Error {
  constructor(message, status, data) {
    super();
    this.status = status || 500;
    this.message = message || common.lang['INTERNAL_ERROR'];
    this.data = data || null;
  }
}

class ValidationError extends Error {
  constructor(data) {
    super();
    this.status = common.statusCode['VALIDATION_ERROR'];
    this.message = message.get('VALIDATION_ERROR');
    this.data = data || null;
  }
}

class InternalError extends Error {
  constructor(data) {
    super();
    this.status = common.statusCode['INTERNAL_ERROR'];
    this.message = message.get('INTERNAL_ERROR');
    this.data = data || null;
  }
}

class UnauthorizedError extends Error {
  constructor(data) {
    super();
    this.status = common.statusCode['UNAUTHORIZED'];
    this.message = message.get('REQUEST_UNAUTHORIZED');
    this.data = data || null;
  }
}

class ForbiddenError extends Error {
  constructor(data) {
    super();
    this.status = common.statusCode['NOT_ALLOWED'];
    this.message = message.get('REQUEST_NOT_ALLOWED');
    this.data = data || message.get('API_PERMISSION_DENIED');
  }
}

module.exports.APIError = APIError;
module.exports.ValidationError = ValidationError;
module.exports.InternalError = InternalError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ForbiddenError = ForbiddenError;
