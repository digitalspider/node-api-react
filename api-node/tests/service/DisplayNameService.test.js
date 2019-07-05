// load environment variables
require('dotenv').config();

const DisplayNameService = require('./../../src/service/DisplayNameService');
const common = require('./../../src/common');
const displayNameService = new DisplayNameService();

describe('DisplayNameService.getArticleDisplayName', () => {
  it('expect title if agencyCode is not defined', () => {
    const article = {
      'title': 'basic',
    };
    const currentUser = {};
    const result = displayNameService.getArticleDisplayName(
      article, currentUser);
    expect(result).toEqual('basic');
  });
  it('expect title if agencyCode is not UMW', () => {
    const article = {
        'title': 'basic',
    };
    const currentUser = {};
    const result = displayNameService.getArticleDisplayName(
      article, currentUser);
    expect(result).toEqual('basic');
  });
  it('expect changed title if agencyCode is UMW', () => {
    const article = {
        'title': 'basic',
        'productCode': 'test1',
    };
    const currentUser = {};
    const result = displayNameService.getArticleDisplayName(
      article, currentUser);
    expect(result).toEqual('test1 - basic');
  });
});
