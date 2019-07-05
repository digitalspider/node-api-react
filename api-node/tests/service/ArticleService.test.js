// load environment variables
require('dotenv').config();

const {articleService} = require('../../src/service/ArticleService');
const {userService} = require('../../src/service/UserService');

describe('ArticleService.getDisplayName', () => {
    let article;
    let currentUser;
    beforeEach(() => {
      currentUser = {};
      article = {recuid: 1, title: 'basic'};
      userService.isAdmin = jest.fn(() => false);
    });
    it('expect title if user is not sysAdmin', () => {
        const result = articleService.getDisplayName(article, currentUser);
        expect(result).toEqual('basic');
    });
    it('expect recuid in title if user is sysAdmin', () => {
        userService.isAdmin = jest.fn(() => true);
        const result = articleService.getDisplayName(article, currentUser);
        expect(result).toEqual('1 - basic');
    });
});
