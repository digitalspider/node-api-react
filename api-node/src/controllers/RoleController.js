const RoleService = require('./../service/RoleService');
const common = require('./../common');
const message = require('./../libs/message');
const roleService = new RoleService();

/** Role controller */
class Role {
  /**
   * Get all roles
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  all(req, res, next) {
    roleService
      .all(req.query.keyword)
      .then((data) => {
        res
          .status(common.statusCode['SUCCESS'])
          .json({message: message.get('GET_ALL_RECORDS'), data: data});
      })
      .catch((error) => {
        next(error);
      });
  }
}

module.exports = new Role();
