const fs = require('fs');

/**
 * Used to ensure all environment variables present in .env.defalt are in .env
 */
module.exports = {
  check: () => {
    let fileName = '.env.default';

    // insert items into nested objects to catch colliding names
    let lines = fs.readFileSync(fileName, 'utf-8').split('\n');
    lines.forEach((line) => {
      if (!line || line[0] === '#') {
        return;
      }
      let items = line.split('=');
      if (items.length > 1) {
        // check that .env.default key exists in process.env
        if (!(items[0] in process.env)) {
          throw new Error(`.env Key missing: ${items[0]}`);
        }
      }
    });
  },
};
