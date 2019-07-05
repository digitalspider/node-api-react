const winston = require('winston');
const DateTime = require('./../libs/Datetime');

// create formatter for dates used as timestamps
let datetime = new DateTime();
const tsFormat = datetime.get('DATETIME_DB');

const Logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL,
  // format: winston.format(jsonFormatter)(),
  transports: [
    // colorize the output to the console
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
    }),
    new winston.transports.File({
      filename: process.env.LOGGER_FILE,
      timestamp: tsFormat, // makes timestamp 'pretty'
      json: false, // makes log format just like console output
  }),
  ],
});

module.exports = Logger;
