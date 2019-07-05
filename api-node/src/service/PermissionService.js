const {sequelize} = require('../models');
const common = require('../common');

class PermissionService {
  /**
   * Verifies whether the user has permission to perform requested
   * operation on given endpoint
   * @param {object} user the user performing the request
   * @param {string} apiUrl the endpoint
   * @param {string} method the operation
   */
  async hasApiPermission(user, apiUrl, method) {
    let roleId = user.roles[0].recuid;

    // get the path of the URL to use in the query
    let path = apiUrl.split(common.api.versionPath)[1];

    let schema = process.env.DB_SCHEMA;
    let sql =
      `SELECT * FROM ${schema}.permission p
       JOIN ${schema}.role_permission rp ON rp.role_id = :roleId
       WHERE :apiEndPoint ~ p.url
       AND p.method = :method
       AND p.permission_id = rp.permission_id`;

    let params = {
      roleId: roleId,
      apiEndPoint: path,
      method: method,
    };
    let result = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
      replacements: params,
    });
    return Array.isArray(result) && result.length > 0;
  }
}

module.exports = PermissionService;
