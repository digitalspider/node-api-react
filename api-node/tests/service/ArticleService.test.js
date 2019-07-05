// load environment variables
require('dotenv').config();

const {articleService} = require('../../src/service/ArticleService');
const {roleService} = require('../../src/service/RoleService');

describe('ArticleService.getDisplayName', () => {
    it('expect title if username is undefined', () => {
        const article = {recuid: 1, title: 'basic'};
        const currentUser = {};
        const result = articleService.getDisplayName(article, currentUser);
        expect(result).toEqual('basic');
    });
    it('expect title if username is not sysAdmin', () => {
        const article = {recuid: 1, title: 'basic'};
        const currentUser = {username: 'test'};
        const result = articleService.getDisplayName(article, currentUser);
        expect(result).toEqual('basic');
    });
    it('expect recuid in title if username is sysAdmin', () => {
        const article = {recuid: 1, title: 'basic'};
        const currentUser = {username: 'admin'};
        const result = articleService.getDisplayName(article, currentUser);
        expect(result).toEqual('1 - basic');
    });
});
