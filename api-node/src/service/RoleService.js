const RoleModel = require('./../models').Role;
const ModelService = require('./ModelService');
const common = require('./../common');

/** Role Service class */
class RoleService extends ModelService {
  constructor() {
    super(RoleModel);
  }

  /**
   * Retrieves a role, given the role name
   * @param {String} name - Name of the role
   * @param {object} transaction - db transaction to use (not compulsory)
   * @return {Object} - Role object
   */
  async getByName(name, {transaction}) {
    let options = {
      where: {name: name},
    };
    if (transaction) {
      options.transaction = transaction;
    }
    return await this.model.findOne(options);
  }
}

// Defining static props
RoleService.ROLE_ADMIN = common.roles.ADMIN;
RoleService.ROLE_MANAGER = common.roles.MANAGER;
RoleService.ROLE_USER = common.roles.USER;

module.exports = RoleService;
module.exports.roleService = new RoleService();
