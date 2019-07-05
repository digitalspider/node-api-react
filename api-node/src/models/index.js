'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/dbconfig.js')[env];
const db = {};

// This is the timestamp identifier in pg lib
let TIMESTAMP_OID = 1114;

// +0000 refers to no timezone
require('pg').types.setTypeParser(TIMESTAMP_OID, (stringValue) => {
  return new Date(stringValue + '+0000');
});

// Override not null validation:
// this is a hack in order to add custom wording to the notNull validation
Sequelize.Validator.notNull = function(item) {
  if (item !== '') {
    return !this.isNull(item);
  }
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config);
}


// convert field name to be snake case
sequelize.beforeDefine((attributes, options) => {
  let dateFields = {};
  if (options.timestamps !== false) {
    dateFields.createdAt = {
        field: 'created_date',
        type: Sequelize.DATE,
    };
    if (options.paranoid !== false) {
      dateFields.deletedAt = {
        type: Sequelize.DATE,
      };
    }
  }
  let defaultOpts = {
    // Log createdAt and deletedAt times
    timestamps: true,
    // when destroy function is called, don't delete but update deletedAt column
    paranoid: options.timestamps !== false,
    // Don't pluralise tablenames
    freezeTableName: true,
    // Disable updatedAt field
    updatedAt: false,
    // Convert camel case names to snake case
    underscored: true,
  };
  Object.assign(attributes, {...dateFields, ...attributes});
  Object.assign(options, {...defaultOpts, ...options});
});

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0)
      && (file !== basename)
      && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    let fileName = file.slice(0, -3);
    db[fileName] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
