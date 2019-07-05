const multer = require('multer');
const Datetime = require('./Datetime');

class File {
  constructor() {
    const {UPLOAD_PATH, MAX_FILE_SIZE} = process.env;
    let storage = multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH);
      },
      filename: function(req, file, cb) {
        let now = new Datetime();
        cb(
          null,
          now.get('MILLISECOND_TIMESTAMP') + '_' + file.originalname
        );
      },
    });
    this.file = multer({storage: storage, limits: {fileSize: MAX_FILE_SIZE}});
  }

  getFileHandler() {
    return this.file;
  }
}

module.exports = new File();
