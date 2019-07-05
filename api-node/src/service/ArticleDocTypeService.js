const ArticleDocTypeModel = require('./../models').ArticleDocType;
const ModelService = require('./ModelService');

/** Article Document Type Service class */
class ArticleDocTypeService extends ModelService {
  constructor() {
    super(ArticleDocTypeModel);
  }
}

module.exports = ArticleDocTypeService;
module.exports.srticleDocTypeService = new ArticleDocTypeService();
