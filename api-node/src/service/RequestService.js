const DateTime = require('../libs/Datetime');
const {InternalError} = require('../libs/APIError');
const message = require('../libs/message');
const md5 = require('md5');

class RequestService {
  constructor() {
    this.requestStore = {};
  }

  /**
   * Generates a requestId, and creates an empty entry
   * in the requestStore object for that requestId
   * @param {String} arg - an argument to be used to generate the requestId
   * @return {String} requestId generated
   */
  initUniqueRequestId(arg = '') {
    let id = false;
    // Ensure to generate a requestId that doesn't exist in requestStore
    while (!id) {
      let datetime = new DateTime();
      let candidate = md5(
        [arg, (datetime.get('MILLISECOND_TIMESTAMP')*Math.random())].join('')
      );
      id = this.requestStore.hasOwnProperty(id)?false:candidate;
    }
    this.set(id);
    return id;
  }

  /**
   * Returns the value of a given requestId
   * @param {String} id - requestId
   * @return {Object} value contained on requestId
   */
  get(id) {
    if (!id) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'id')
      );
    }
    return requestStore[id] || null;
  }

  /**
   * Sets a given value to a requestId
   * @param {String} id - requestId
   * @param {Object=} value
   */
  set(id, value = {}) {
    if (!id) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'id')
      );
    }
    this.requestStore[id] = value;
  }

  /**
   * Deletes from the requestStore a given requestId
   * @param {String} id - requestId
   */
  unset(id) {
    if (id) {
      delete this.requestStore[id];
    }
  }

  /**
   * Returns the value of a key for a given requestId
   * @param {String} id - requestId
   * @param {String} key - index to set in requestStore
   * @return {Object} value contained on the key
   */
  getKey(id, key) {
    if (!id) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'id')
      );
    }
    if (!key) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'key')
      );
    }
    return this.requestStore[id][key] || null;
  }

  /**
   * Sets for a given requestId, a {key: value} entry
   * @param {String} id - requestId
   * @param {String} key - index to set in requestStore
   * @param {Object=} value - value to set to the given key
   */
  setKey(id, key, value = {}) {
    if (!id) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'id')
      );
    }
    if (!key) {
      throw new InternalError(
        message.getAndReplace('PARAMETER_REQUIRED', 'key')
      );
    }
    this.requestStore[id][key] = value;
  }
};

module.exports = RequestService;
module.exports.requestService = new RequestService();
