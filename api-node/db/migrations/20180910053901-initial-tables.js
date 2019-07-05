'use strict';
const schema = process.env.DB_SCHEMA;
let initTablesStr = require('../sql_schema')(schema);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(initTablesStr);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `DROP TABLE IF EXISTS ${schema}.user_role CASCADE;`
      + `DROP TABLE IF EXISTS ${schema}.role CASCADE;`
      + `DROP TABLE IF EXISTS ${schema}.user CASCADE;`
    );
  },
};
