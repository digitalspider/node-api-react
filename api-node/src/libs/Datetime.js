const moment = require('moment');
const common = require('./../common');

/** Wrapper class for moment for formatting */
class Datetime {
  /**
   * Creates a datetime object
   * @constructor
   * @param {datetime} value - value to initialise moment object with
   */
  constructor(value) {
    this.formats = common.moment.formats;
    if (value) {
      this.moment = moment(value);
    } else {
      this.moment = moment();
    }
  }

  /**
   * Get the year of this datetime object
   * @return {string} - current year as a string
   */
  getYear() {
      return this.moment.format('YYYY');
  }

  /**
   * Returns the value of this datetime object in a given format
   * @param {string} format - common.moment.format key to get time format string
   * @return {string} - datetime value represented in the given format
   */
  get(format) {
    return this.moment.format(this.formats[format]);
  }

  /**
   * Adds a time period to a datetime object
   * @param {Integer} number - number to be add
   * @param {String} unit - includes (seconds|minutes|hours|days|months|years)
   * @return {Datetime} the modified object
   */
  add(number, unit) {
    this.moment.add(number, unit);
    return this;
  }

  /**
   * get the moment object this class wraps
   * @return {moment} - moment object
   */
  getMoment() {
    return this.moment;
  }
}

module.exports = Datetime;
