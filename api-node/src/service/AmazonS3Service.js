// Utils
const AWS = require('aws-sdk');
const fs = require('fs');

const PREFIX = process.env.AWS_S3_PREFIX;
/** Amazon S3 Service */
class AmazonS3Service {
  constructor() {
    this.init();
  }

  /**
   * Initializes the aws service
   */
  async init() {
    //  TODO: This is not SAFE! If cache is not populatd, and DB access
    // takes a long time there is a risk that s3 variable
    // will not be configured!
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.s3 = new AWS.S3();
    this.omsBucket = process.env.AWS_BUCKET_NAME;
  }

  /**
   * list all s3 buckets
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @param  {Object} next - next object
   */
  list(req, res, next) {
    let params = {
      Bucket: omsBucket,
      Prefix: PREFIX,
    };
    s3.listObjects(params, (err, data) => {
      if (err) {
        throw err;
      }
      return data;
    });
  }

  /**
   * Get a file from s3
   * @param {String} key - the s3 object key
   * @param {String} versionId - the version Id of the object
   * @return {Promise<Blob>} - The file to be sent
   */
  get(key, versionId) {
    let params = {
      Bucket: this.omsBucket,
      Key: key,
      VersionId: versionId,
    };
    return this.s3.getObject(params).promise();
  }

  /**
   * Save file to s3 bucket
   * @param {String} filePath - Local file pathe where file is stored
   * @param {String} keyPath - s3 key path to store file at
   * @param {Object} metadata - metadata to attach to s3 object
   * @return {Promise} - @todo what does this return?
   */
  save(filePath, keyPath, metadata) {
    let params = {
      Bucket: this.omsBucket,
      Body: fs.createReadStream(filePath),
      Metadata: metadata,
      Key: [PREFIX, keyPath].join('/'),
    };
    return this.s3.upload(params).promise();
  }
}

module.exports = new AmazonS3Service();
