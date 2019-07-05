// Utils
const {Sequelize} = require('../models');
const _ = require('lodash');
const common = require('./../common');

// Models
const AuditLogModel = require('./../models').AuditLog;
const UserModel = require('./../models').User;
const ArticleTypeModel = require('./../models').ArticleType;
const ArticleStatusModel = require('./../models').ArticleStatus;

// Audit Log Event Types
const EVENT_CREATE = 'CREATE';
const EVENT_UPDATE = 'UPDATE';
const EVENT_DELETE = 'DELETE';
const EVENT_DOWNLOAD = 'DOWNLOAD';

/** AuditLogService class */
class AuditLogService {
  constructor() {
    let include = [
      {model: UserModel, as: 'user'},
    ];
    this.model = AuditLogModel;
    this.defaultOpts = {
      include: include,
    };

    // Defines a map of model lookups, and the display field to extract
    this.modelLookup = {
      [common.audit.AUDIT_TYPE_USER]: {
        'model': UserModel, 'displayFieldName': 'name',
      },
      [common.audit.AUDIT_TYPE_ARTICLE_TYPE]: {
        'model': ArticleTypeModel, 'displayFieldName': 'name',
      },
      [common.audit.AUDIT_TYPE_ARTICLE_STATUS]: {
       'model': ArticleStatusModel, 'displayFieldName': 'name',
      },
    };
  }

  /** gets all rows from the model
   * @param {Object} options - sequelize properties object
   * @return {Promise} - an array of all the rows in the
   *                            database as objects
   */
  all(options) {
    return this.model.findAll(Object.assign({}, this.defaultOpts, options));
  }

  /**
   * Create an instance of the model
   * @param {Object} data - the data to enter into the new instance
   * @param {Object} options - sequelize properties object
   * @return {Promise}
   */
  create(data, options) {
    return this.model.create(data, options);
  }

  /* Format parameters to create an AuditLog */
  formatData(
    event, objectType, objectId, detail, parentType, parentId, userId
  ) {
    return {
      objectType: objectType,
      objectId: objectId,
      userId: userId,
      event: event,
      detail: detail,
      parentType: parentType ? parentType : null,
      parentId: parentId ? parentId : null,
    };
  }

  /**
   * Creates an audit log
   * @param {String} event - the type of audit event, CREATE, UPDATE, DELETE
   * @param {String} objectType - the type of object, e.g. Article, etc
   * @param {Number} objectId - the id of the object
   * @param {String} detail - the json representation of the differences
   * @param {Object} options - sequelize properties object
   * @param {String} parentType - the type of parent, e.g. Article or null
   * @param {Number} parentId - the id of the parent, or null
   * @param {Number} userId - the id of the user that creates the change
   * @return {Promise} data - resolved should contain the AuditLog created
   */
  async register(
    event, objectType, objectId, detail, options, parentType, parentId, userId
  ) {
    let data = this.formatData(
      event,
      objectType, objectId,
      detail,
      parentType, parentId,
      userId
    );
    return await this.create(data, options);
  }

  /**
   * Create an AuditLog using model information, for event=CREATE
   * @param {Number} userId - the user id
   * @param {*} model - the sequelize model, with tableName and definition
   * @param {Number} entityId - the id of the model being created
   * @param {*} data - the data of the model being created
   * @param {*} options - any additional options, including transaction info
   * @param {Number} parentId - the id of the parent object
   */
  async registerCreate(
    userId, model, entityId, data, options, parentId
  ) {
    if (!model.options.auditEnable) {
      return undefined;
    }
    let parentType = null;
    if (parentId) {
      parentType = model.options.auditParentType;
    }
    const changes = await this.getContentChanges(
      data, model, options.transaction);
    if (changes.length>0) {
      return await this.register(
        EVENT_CREATE,
        model.tableName, entityId,
        JSON.stringify(changes), options,
        parentType, parentId,
        userId
      );
    }
  }

  /**
   * Create an AuditLog using model information, for event=DELETE
   * @param {Number} userId - the user id
   * @param {*} model - the sequelize model, with tableName and definition
   * @param {Number} entityId - the id of the model being updated
   * @param {*} options - any additional options, including transaction info
   * @param {Number} parentId - the id of the parent object
   */
  async registerDelete(
    userId, model, entityId, options, parentId
  ) {
    if (!model.options.auditEnable) {
      return undefined;
    }
    let parentType = null;
    if (parentId) {
      parentType = model.options.auditParentType;
    }
    const data = {
      recuid: entityId,
    };
    const changes = await this.getContentChanges(data, model);
    if (changes.length>0) {
      return await this.register(
        EVENT_DELETE,
        model.tableName, entityId,
        JSON.stringify(changes), options,
        parentType, parentId,
        userId
      );
    }
  }

  /**
   * Create an AuditLog using model information, for event=DOWNLOAD
   * @param {Number} userId - the user id
   * @param {*} model - the sequelize model, with tableName and definition
   * @param {Number} entityId - the id of the model being created
   * @param {*} data - the data of the model being created
   * @param {*} options - any additional options, including transaction info
   * @param {Number} parentId - the id of the parent object
   */
  async registerDownload(
    userId, model, entityId, data, options, parentId
  ) {
    if (!model.options.auditEnable) {
      return undefined;
    }
    let parentType = null;
    if (parentId) {
      parentType = model.options.auditParentType;
    }
    const changes = await this.getContentChanges(data, model);
    if (changes.length>0) {
      return await this.register(
        EVENT_DOWNLOAD,
        model.tableName, entityId,
        JSON.stringify(changes), options,
        parentType, parentId,
        userId
      );
    }
  }

  /**
   * Create an AuditLog using model information, for event=CREATE
   * @param {Number} userId the user id
   * @param {*} model - the sequelize model, with tableName and definition
   * @param {*} entityFrom - the data of the model being updated, before update
   * @param {*} entityTo - the data of the model being updated, after update
   * @param {*} options - any additional options, including transaction info
   * @param {Number} parentId - the id of the parent object
   */
  async registerUpdate(
    userId, model, entityFrom, entityTo, options, parentId
  ) {
    if (!model.options.auditEnable) {
      return undefined;
    }
    let parentType = null;
    if (parentId) {
      parentType = model.options.auditParentType;
    }
    const changes = await this.getUpdateChanges(
      model, entityFrom, entityTo, options.transaction);
    if (changes.length>0) {
      return await this.register(
        EVENT_UPDATE,
        model.tableName, entityTo.recuid,
        JSON.stringify(changes), options,
        parentType, parentId,
        userId
      );
    }
  }

  /**
   * Retrieve auditLog history for an model object
   * @param {String} objectType - the name of model
   * @param {Number} objectId - the id of the model
   * @param {*} options - any additional options, including transaction info
   * @return {Object} - the JSON object representing an array of AuditLogs
   */
  async getByTypeFormatted(objectType, objectId, options={}) {
    // Default columns to pull
    options.attributes = ['objectType', 'event', 'createdAt', 'detail'];
    let data = await this.getByType(objectType, objectId, options);

    // Apply format to send in the response
    for (let i=0; i<data.length; i++) {
      if (data[i].detail) {
        data[i].detail = JSON.parse(data[i].detail);
       if ((data[i].detail.length > 0) && Array.isArray(data[i].detail)) {
          for (let j=0; j<data[i].detail.length; j++) {
            delete data[i].detail[j].field;
            delete data[i].detail[j].dbColumn;
            delete data[i].detail[j].valueRef;
            delete data[i].detail[j].valueFromRef;
            delete data[i].detail[j].valueToRef;
            delete data[i].detail[j].lookupKey;
            delete data[i].detail[j].lookupTable;
          }
        }
      }
    }
    return data;
  }


  /**
   * Retrieve auditLog history for an model object, using both
   * objectType/Id and parentType/Id.
   * The options also take, orderBy, limit, and other sorting/filtering
   * criteria.
   * @param {String} objectType - the name of model
   * @param {Number} objectId - the id of the model
   * @param {*} options - any additional options, including transaction info
   * @return {Object} the JSON object representing an array of AuditLogs
   */
  async getByType(objectType, objectId, options = {}) {
    // Define parameters
    let params = {
      where: {},
      include: [{all: true}],
      attributes: options.attributes ? options.attributes : {},
    };

    // Define limit options
    if (options.limit) {
      params.limit = options.limit;
      params.offset = options.offset ? options.offset : 0;
    }

    // Define logic to sort
    params.order = [['createdAt', 'ASC']];
    if (options.orderBy) {
      if (options.orderBy === 'user') {
        params.order = [
          [
            UserModel,
            'name',
            options.orderDir ? options.orderDir : 'ASC',
          ],
        ];
      } else {
        params.order = [
          [options.orderBy, options.orderDir ? options.orderDir : 'ASC'],
        ];
      }
    }

    let {Op} = Sequelize;
    // Default filter definition
    params.where[Op.or] = [
      {
        [Op.and]: [
          {objectType: objectType},
          {objectId: objectId},
        ],
      },
      {
        [Op.and]: [
          {parentType: objectType},
          {parentId: objectId},
        ],
      },
    ];
    return await this.all(params);
  }

  /**
   * Get the field differences between the object and the base
   * @param {*} object - the object being compared
   * @param {*} base - the base object to compare to
   * @return {String} json representation of the differences
   */
  difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] =
            _.isObject(value) && _.isObject(base[key]) &&
            !base[key] instanceof Sequelize.Model
              ? changes(value, base[key])
              : value;
        }
      });
    }
    return changes(object, base);
  }

  /**
   * Given data and a model, returns a formatted array with the fields
   * in data, merging with the model attributes.
   * @param {*} data - the object containing content
   * @param {*} model - the sequelize model representation
   * @param {Object} transaction - optional sequelize transaction
   * @return {Array} a formatted array of the fields
   */
  async getContentChanges(data, model, transaction) {
    let changes = [];
    if (!data || !model) {
      return changes;
    }
    // Extract dataValues from the sequelize objects
    data = data.dataValues ? data.dataValues : data;
    for (let fieldName in data) {
      if (!data.hasOwnProperty(fieldName)) {
        continue;
      }
      // Get column meta data from sequelize model
      const columnMetaData = model.rawAttributes[fieldName];
      if (columnMetaData && !columnMetaData.auditExclude) {
        const columnDataType = this.getColumnType(columnMetaData);
        const columnLabel = this.getColumnLabel(columnMetaData);
        let fieldValue = await this.getFieldValue(
            data, fieldName, columnMetaData, transaction);
        let details = {
          field: columnMetaData.fieldName,
          dbColumn: columnMetaData.field,
          label: columnLabel,
          type: columnDataType,
          value: fieldValue,
        };
        changes.push(details);
      }
    }
    return changes;
  }

  /**
   * Given a model, returns a formatted array with the differences
   * between objectFrom and objectTo, merging with the model attributes.
   * @param {Object} model - the sequelize model representation
   * @param {Object} objectFrom - the object before the change
   * @param {Object} objectTo - the object after the change
   * @param {Object} transaction - optional sequelize transaction
   * @return {Array} a formatted array of the changes
   */
  async getUpdateChanges(model, objectFrom, objectTo, transaction) {
    let changes = [];
    // Extract dataValues from the sequelize objects
    objectFrom = objectFrom.dataValues ? objectFrom.dataValues : objectFrom;
    objectTo = objectTo.dataValues ? objectTo.dataValues : objectTo;
    // Get the differences in these two objects
    let differences = this.difference(objectFrom, objectTo);
    if (!differences) {
      return;
    }

    for (let fieldName in differences) {
      if (!differences.hasOwnProperty(fieldName)) {
        continue;
      }
      // Get column meta data from sequelize model
      const columnMetaData = model.rawAttributes[fieldName];
      if (columnMetaData && !columnMetaData.auditExclude) {
        const columnDataType = this.getColumnType(columnMetaData);
        const columnLabel = this.getColumnLabel(columnMetaData);
        let fromValue = await this.getFieldValue(
            objectFrom, fieldName, columnMetaData, transaction);
        let toValue = await this.getFieldValue(
            objectTo, fieldName, columnMetaData, transaction);
        let details = {
          field: columnMetaData.fieldName,
          dbColumn: columnMetaData.field,
          label: columnLabel,
          type: columnDataType,
          valueFrom: fromValue,
          valueTo: toValue,
        };
        changes.push(details);
      }
    }
    return changes;
  }

  /**
   * Return the sequelize DataType of the column,
   * trimming of SPACE and '('. e.g. VARCHAR(255) returns VARCHAR.
   * If the value is an INTEGER, and it references another model
   * return the 'auditType' value in the metadata.
   * @param {*} columnMetaData - metadata of the column attribute
   * @return {String} - the type of the column
   */
  getColumnType(columnMetaData) {
    let columnDataType = columnMetaData.type;
    if (columnDataType) {
      columnDataType = String(columnDataType).split(' ')[0].split('(')[0];
      if (columnDataType === 'INTEGER' && columnMetaData.references &&
          columnMetaData.references.model && columnMetaData.auditType) {
        columnDataType = columnMetaData.auditType;
      }
      return columnDataType;
    }
  }

  /**
   * Return the metadata 'auditLabel' if provided,
   * otherwise the 'fieldName' value.
   * @param {*} columnMetaData - metadata of the column attribute
   * @return {String} - the label of the column
   */
  getColumnLabel(columnMetaData) {
    return columnMetaData.auditLabel ?
      columnMetaData.auditLabel : columnMetaData.fieldName;
  }

  /**
   * Return the fieldName value of the data.
   * If the {@link #getColumnType} is another model, i.e. auditType, then use
   * {@link #getDisplayValueFromLookup} to get the value for this column.
   * @param {*} data - the data in the model
   * @param {*} fieldName - the fieldName we want to extract from the data
   * @param {*} columnMetaData - metadata of the column attribute
   * @param {Object} transaction - optional sequelize transaction
   * @return {String} - the value of the fieldName from the data
   */
  async getFieldValue(data, fieldName, columnMetaData, transaction) {
    let fieldValue = _.get(data, fieldName, '');
    let columnDataType = this.getColumnType(columnMetaData);
    switch (columnDataType) {
      case common.audit.AUDIT_TYPE_USER:
      case common.audit.AUDIT_TYPE_ARTICLE_STATUS:
      case common.audit.AUDIT_TYPE_ARTICLE_TYPE:
        fieldValue = await this.getDisplayValueFromLookup(
          columnDataType, fieldValue, transaction);
        break;
      case 'DATE':
        // TODO: Do some formatting on dates!
        break;
    }
    return fieldValue;
  }

  /**
   * Get the lookup value by doing a findByPk() on an associated model.
   * The associated model is retrieved from {@link #modelLookup},
   * parameter 'model'.
   * @param {String} lookupKey - one of the values of AUDIT_TYPE.
   * @param {Number} lookupId - the id of the model we are searching
   * @param {Object} transaction - optional sequelize transaction
   * @return {Object} - the value of field 'displayFieldName' from the
   *      returned data
   */
  async getDisplayValueFromLookup(lookupKey, lookupId, transaction) {
    const lookupModel = this.modelLookup[lookupKey];
    if (lookupModel) {
      const options = transaction ? {transaction: transaction} : {};
      const lookupObject = await lookupModel.model.findByPk(lookupId, options);
      if (lookupObject) {
        return lookupObject[lookupModel.displayFieldName];
      }
    }
  }
}

module.exports = AuditLogService;
module.exports.auditLogService = new AuditLogService();
