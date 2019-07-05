const {requestService} = require('../service/RequestService');
const UserService = require('../service/UserService');
const PermissionService = require('../service/PermissionService');
const {UnauthorizedError, ForbiddenError} = require('../libs/APIError');
const message = require('../libs/message');

let userService = new UserService();
let permissionService = new PermissionService();

module.exports = (req, res, next) => {
  if (process.env.AUTH_ENABLED === 'false') {
      userService.getSysAdminUser().then((user) => {
        const requestId = requestService.initUniqueRequestId();
        requestService.setKey(requestId, 'currentUser', user);
        req.requestId = requestId;
        next();
      }).catch((error) => {
        next(error);
      });
  } else {
    userService.verifyToken(req.headers.authtoken).then((user) => {
      if (!user) {
        throw new UnauthorizedError(message.get('TOKEN_INVALID'));
      }
      permissionService.hasApiPermission(user, req.originalUrl, req.method)
      .then((result) => {
        if (result) {
          const requestId = requestService.initUniqueRequestId(user.token);
          requestService.setKey(requestId, 'currentUser', user);
          req.requestId = requestId;
          next();
        } else {
          throw new ForbiddenError();
        }
      }).catch((error) => {
        next(error);
      });
    })
    .catch((error) => {
      next(error);
    });
  }
};
