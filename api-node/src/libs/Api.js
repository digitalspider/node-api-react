const request = require('request-promise');
const {ValidationError} = require('../libs/APIError');
const logger = require('./../service/LoggerService');

class Api {
  constructor(retry = 0, retryCallback, headers) {
    this.retry = retry;
    this.retryCallback = retryCallback;
    this.headers = headers;
  }

  getHeaders() {
    return this.headers;
  }

  setHeaders(headers) {
    this.headers = headers;
  }

  async get(url, options = {}) {
    options['uri'] = url;
    return await this.invokeRequest(url, options);
  }

  async post(url, options) {
    options['method'] = 'POST';
    options['body'] = JSON.stringify(options.body);
    return await this.invokeRequest(url, options);
  }

  async put(url, options) {
    options['method'] = 'PUT';
    options['body'] = JSON.stringify(options.body);
    return await this.invokeRequest(url, options);
  }

  async invokeRequest(url, options) {
    let successful = false;
    let response = {};
    for (let i = 0; !successful && i <= this.retry; i++) {
      try {
        let headers = this.getHeaders();
        response = await request(url, {
          ...options,
          headers,
        });
        let {statusCode} = JSON.parse(response);
        if (statusCode >= 200 && statusCode <= 299) {
          successful = true;
        }
      } catch (err) {
        logger.error(`Call failed ${err}`);
        response = err.error;
        await this.retryCallback(err.statusCode);
      }
    }
    return this.parseResponse(response);
  }

  parseResponse(response) {
    let json = JSON.parse(response);
    if (json.statusCode < 200 || json.statusCode > 299) {
      throw new ValidationError(
        json.errorMessage || json.result.errors || json.result);
    }
    return json;
  }
}

module.exports = Api;
