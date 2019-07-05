import {observable, toJS, decorate, action} from 'mobx';
import Api from '../utils/Api';
import _ from 'lodash';
import {getBaseApiUrl} from '../utils/helper';

class User {
  id;
  username;
  email;
  roles;
  createdAt;

  constructor(
    id,
    username,
    email,
    roles,
    createdAt,
  ) {
    this.id = id || '';
    this.username = username || '';
    this.email = email || '';
    this.roles = roles || [];
    this.createdAt = createdAt || '';
  }

  /**
   *  Automatically called by JSON.stringify
   *  @return {object} JSON values to be sent to the API
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      roles: this.roles,
      createdAt: this.createdAt,
    };
  }
}

const URL = getBaseApiUrl() + '/user';

class UserStore {
  newUser() {
    return new User();
  }

  async getUsers() {
    let result = await Api.get(URL + '/');
    return result.data;
  }

  createUser(user) {
    return Api.post(URL, user);
  }

  updateUser(id, user) {
    return Api.put(`${URL}/${id}`, user);
  }

  async getUser(id) {
    let result = await Api.get(`${URL}/${id}`);
    return this.initUser(result.data);
  }

  /**
   * Creates a deep clone of the provided user instance
   * @param {Object} user
   * @return {Article} clone of article parameter
   */
  clone(user) {
    return this.initUser(_.cloneDeep(toJS(user)));
  }

  initUser = (data) => {
    return new User(
      data.id,
      data.username,
      data.email,
      data.roles,
      data.createdAt,
    );
  }

  formatUser(user) {
    return [
      {label: 'Username', value: user.username},
      {label: 'Email', value: user.email},
    ];
  }
}

decorate(UserStore, {
  id: observable,
  username: observable,
  email: observable,
  roles: observable,
  getUser: action,
  getUsers: action,
});

export default new UserStore();
