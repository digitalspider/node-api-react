'use strict';
const schema = process.env.DB_SCHEMA;
let initDataStr = require('../sql_data')(schema);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(initDataStr);
  },
  down: (queryInterface, Sequelize) => {
    // TODO: implement drop data
    return null;
  },
};
