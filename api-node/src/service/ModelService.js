const {requestService} = require('./RequestService');
const {Sequelize, sequelize} = require('../models');
const {ValidationError} = require('../libs/APIError');
const message = require('./../libs/message');
const {auditLogService} = require('./AuditLogService');

class ModelService {
  /** ModelService to wrap model related services
   * @constructor
   * @param {Model} model - The model that this service wraps
   * @param {Array} include - A list of models to include
   */
  constructor(model, include = []) {
    this.model = model;
    this.defaultOpts = {
      include: include,
    };
  }

  /** Returns the default model
   * @param {String} requestId
   * @param {Object} transaction - the transaction to use, or null
   * @param {String} scope - the scope to use, optional
   * @return {Object} - Sequelize object
   */
  async loadModel(requestId, transaction, ...scope) {
    if (scope && scope.length>0) {
      return this.model.scope(scope);
    }
    return this.model;
  }

  /** gets all rows from the model
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @return {Promise} - an array of all the rows in the
   *                            database as objects
   */
  async all(requestId, options = {}) {
    const scopedModel = await this.loadModel(requestId, options.transaction);
    return scopedModel.findAll(
      Object.assign({}, this.defaultOpts, options)
    );
  }

  /** gets a specific instance of the model
   * @param {String} requestId
   * @param {Object} id - the recuid of the requested object
   * @param {Object} options - sequelize properties object
   * @return {Promise} - the model with recuid=id or null if it doesn't exist
   */
  async get(requestId, id, options = {}) {
    options.where = Object.assign({}, options.where, {recuid: id});
    const scopedModel = await this.loadModel(requestId, options.transaction);
    const findOptions = Object.assign({}, this.defaultOpts, options);
    return scopedModel.findOne(findOptions);
  }

  /** gets a specific instance of the model without using load model
   * Should only be used for audit logging
   * TODO: This is a hack to get around the scope
   * should be fixed by a redesign of scoped permissions
   * @param {Object} id - the recuid of the requested object
   * @param {Object} options - sequelize properties object
   * @return {Promise} - the model with recuid=id or null if it doesn't exist
   */
  async getUnscoped(id, options = {}) {
    options.where = Object.assign({}, options.where, {recuid: id});
    const findOptions = Object.assign({}, this.defaultOpts, options);
    return this.model.findOne(findOptions);
  }

  /** create an instance of the model
   * @param {String} requestId
   * @param {Object} data - the data to enter into the new instance
   * @param {Object} options - sequelize properties object
   * @return {Promise}
   */
  create(requestId, data, options = {}) {
    if (options.transaction instanceof Sequelize.Transaction) {
      return this._create(requestId, data, options);
    } else {
      return sequelize.transaction(async (trans) => {
        options = Object.assign({transaction: trans}, options);
        return this._create(requestId, data, options);
      });
    }
  }

  /** create an instance of the model
   * @param {String} requestId
   * @param {Object} data - the data to enter into the new instance
   * @param {Object} options - sequelize properties object
   * @return {Promise}
   */
  _create(requestId, data, options) {
    options = Object.assign({fields: Object.keys(data)}, options);
    return this.model.create(data, options);
  }

  /** update an existing instance
   * @param {String} requestId
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} data - the data to enter into the instance
   * @param {Object} options - sequelize properties object
   * @return {Promise} - resolved should contain the record that was updated
   */
  async update(requestId, id, data, options = {}) {
    // Check the user has valid scope
    let entity = await this.get(requestId, id, options);
    if (!entity) {
      throw new ValidationError(
        message.get('RECORD_NOT_FOUND_OR_PERMITTED'));
    }
    let updateOpts = {
      where: {recuid: id},
      include: null,
      individualHooks: true,
      fields: Object.keys(data),
    };
    // TODO: scopes and update not working!
    return this.model.update(data,
      Object.assign({}, updateOpts, options)
    ).then(([rowsUpdate, [updatedEntity]]) => {
      // @todo: log change
      return updatedEntity;
    });
  }

  /** delete an existing instance
   * @param {String} requestId
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} options - sequelize properties object
   * @return {Promise}
   */
  async delete(requestId, id, options = {}) {
    // Check the user has valid scope
    let entity = await this.get(requestId, id, options);
    if (!entity) {
      throw new ValidationError(
        message.get('RECORD_NOT_FOUND_OR_PERMITTED'));
    }
    let deleteOpts = {
      where: {recuid: id},
      individualHooks: true,
    };
    return this.model.destroy(
      Object.assign({}, deleteOpts, options)
    ).then((data) => {
      // @todo: log change
      if (data < 1) {
        throw new ValidationError(message.get('NO_RECORD_DELETED'));
      }
      return data;
    });
  }

  /**
   * Create an instance of the model, and record auditLog
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @return {Promise} - resolved should contain the record that was created
   */
  async createAndAudit(data, requestId, options = {}, parentId = null) {
    if (options.transaction instanceof Sequelize.Transaction) {
      return this._createAndAudit(data, requestId, options, parentId);
    } else {
      return sequelize.transaction(async (trans) => {
        options = Object.assign({transaction: trans}, options);
        return this._createAndAudit(data, requestId, options, parentId);
      });
    }
  }

  /**
   * Create an instance of the model, and record auditLog
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @return {Promise} - resolved should contain the record that was created
   */
  async _createAndAudit(data, requestId, options = {}, parentId = null) {
    let auditOptions = {transaction: options.transaction};
    // copy valid transaction into options
    let entity = await this._create(requestId, data, options);
    const currentUser = requestService.getKey(requestId, 'currentUser');
    await auditLogService.registerCreate(
      currentUser.recuid, this.model,
      entity.recuid, data, auditOptions, parentId);
    return entity;
  }

  /** update an existing instance
   * @param {Integer} id - the recuid of the existing instance
   * @param {Object} data - the data to enter into the instance
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @return {Promise} - resolved should contain the record that was updated
   */
  async updateAndAudit(id, data, requestId, options = {}, parentId = null) {
    return sequelize.transaction(async (trans) => {
      let transaction = options.transaction ? options.transaction : trans;
      let auditOptions = {transaction};
      // copy valid transaction into options
      let actionOptions = Object.assign({}, options, auditOptions);
      const entityPrevious = await this.getUnscoped(id, auditOptions);
      const entity = await this.update(requestId, id, data, actionOptions);
      const newEntity = await this.getUnscoped(id, auditOptions);
      if (entityPrevious && entity && newEntity) {
        const currentUser = requestService.getKey(requestId, 'currentUser');
        await auditLogService.registerUpdate(
          currentUser.recuid,
          this.model, entityPrevious, newEntity, auditOptions, parentId);
        return entity;
      } else {
        throw new ValidationError(
          message.get('RECORD_NOT_FOUND_OR_PERMITTED'));
      }
    });
  }

  /**
   * Delete an existing instance
   * @param {Integer} id - the recuid of the existing instance
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @param {Integer} parentId - The recuid of the parent object, for audit logs
   * @return {Promise} - resolved should contain the id of the record deleted
   */
  async deleteAndAudit(id, requestId, options = {}, parentId = null) {
    return sequelize.transaction(async (trans) => {
      let transactionToUse = options.transaction ? options.transaction : trans;
      let auditOptions = {transaction: transactionToUse};
      // copy valid transaction into options
      let actionOptions = Object.assign({}, options, auditOptions);
      let data = await this.delete(requestId, id, actionOptions);
      if (data) {
        const currentUser = requestService.getKey(requestId, 'currentUser');
        await auditLogService.registerDelete(
          currentUser.recuid,
          this.model, id, auditOptions, parentId);
        return data;
      } else {
        throw new ValidationError(
          message.get('RECORD_NOT_FOUND_OR_PERMITTED'));
      }
    });
  }

  /** gets a single row from the database
   * @param {String} requestId
   * @param {Object} options - sequelize properties object
   * @return {Promise} - the model with based on the options criteria,
   * or null if it doesn't exist
   */
  async findOne(requestId, options) {
    const scopedModel = await this.loadModel(requestId, options.transaction);
    return scopedModel.findOne(Object.assign({}, this.defaultOpts, options));
  }
}

module.exports = ModelService;
