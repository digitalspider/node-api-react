const {Op} = require('../models').Sequelize;
let util = {
  /**
   * Compares string ignoring case
   * @param {String} a
   * @param {String} b
   * @return {Number} a > b
   */
  strCmp(a, b) {
    let nameA = a.toUpperCase();
    let nameB = b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  },

  /**
   * parse filter options from front end
   * todo: move to util?
   * @param {Object} options - sequelize options object
   * @return {Object} - sequelize options object
   */
  parseFilter(options) {
    if (!options) return {};
    let res = {};
    for (key in options) {
      if (['where', 'limit', 'offset', 'order'].includes(key)) {
        if (key === 'where') {
          res[key] = util.replaceSequelizeOperators(options[key]);
        } else {
          res[key] = options[key];
        }
      }
    }
    return res;
  },

  /**
   * Recursively looks through a where query and if an escaped operator is found
   * it is replaced with the equivalent operator from the Sequelize.Op object
   * @param {Object} whereObj - Sequelize where object
   * @return {Object} - whereObj with operators transformed
   */
  replaceSequelizeOperators(whereObj) {
    if (['string', 'number'].includes(typeof whereObj)) return whereObj;
    if (Array.isArray(whereObj)) {
      return whereObj.map(util.replaceSequelizeOperators);
    }
    let result = {};
    for (key in whereObj) {
      if (!key) continue;
      let opStr = key.split('$');
      if (opStr.length == 2) {
        result[Op[opStr[1]]] = util.replaceSequelizeOperators(whereObj[key]);
      } else {
        result[key] = util.replaceSequelizeOperators(whereObj[key]);
      }
    }
    return result;
  },
};

module.exports = util;
