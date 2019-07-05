import {observable, toJS, decorate, action} from 'mobx';
import Api from '../utils/Api';
import _ from 'lodash';
import {getBaseApiUrl} from '../utils/helper';

class Article {
  id;
  title;
  content;
  articleStatus;
  createdAt;
  createdBy;

  constructor(
    id,
    title,
    content,
    articleStatus,
    createdAt,
    createdBy,
  ) {
    this.id = id || '';
    this.title = title || '';
    this.content = content || '';
    this.articleStatus = articleStatus || {};
    this.articleStatuses = {};
    this.createdAt = createdAt || '';
    this.createdBy = createdBy || '';
  }

  /**
   *  Automatically called by JSON.stringify
   *  @return {object} JSON values to be sent to the API
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      articleStatusId: this.articleStatusId,
      createdBy: this.createdBy.id,
    };
  }
}

const URL = getBaseApiUrl() + '/article';

class ArticleStore {
  newArticle() {
    return new Article();
  }

  fetchSelectedArticle(id) {
    let self = this;
    return Promise.all([
      self.getArticle(id),
      self.getArticleStatuses(),
    ]).then(([article, statuses]) => {
      this.articleStatuses = statuses;
    });
  }

  async getArticles() {
    let result = await Api.get(URL + '/');
    return result.data;
  }

  createArticle(article) {
    return Api.post(URL, article);
  }

  updateArticle(id, article) {
    return Api.put(`${URL}/${id}`, article);
  }

  async getArticle(id) {
    let result = await Api.get(`${URL}/${id}`);
    return this.initArticle(result.data);
  }

  async getArticleStatuses() {
    let result = await Api.get(URL + '/status');
    return result.data;
  }

  /**
   * Creates a deep clone of the provided article instance
   * @param {Object} article
   * @return {Article} clone of article parameter
   */
  clone(article) {
    return this.initArticle(_.cloneDeep(toJS(article)));
  }

  initArticle = (data) => {
    return new Article(
      data.id,
      data.title,
      data.content,
      data.articleStatus,
      data.createdAt,
      data.createdBy,
    );
  }

  formatArticle(article) {
    const {createdBy} = article;
    return [
      {label: 'Creator', value: createdBy && createdBy.name},
      {label: 'Article Title', value: article.title},
      {label: 'Article Content', value: article.content},
    ];
  }
}

decorate(ArticleStore, {
  id: observable,
  title: observable,
  content: observable,
  articleStatus: observable,
  getArticle: action,
  getArticles: action,
  getArticleStatuses: action,
});

export default new ArticleStore();
