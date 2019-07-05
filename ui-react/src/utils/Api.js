import Storage from './Storage';
import {observable, decorate} from 'mobx';
import Notifier from '../stores/NotifierStore';
import common from '../common';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory({forceRefresh: true});

class Api {
  redirectToLogin = false;
  redirectCounter = 0;

  constructor() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', null);
    // Force no-cache for IE11 to prevent stale data
    this.headers.append('Cache-Control', 'no-store');
    this.headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    this.headers.append('Pragma', 'no-cache');
    this.headers.append('Expires', '0');
  }

  async delete(url) {
    this.headers.set('Authorization', Storage.getSessionAttr('token'));
    let options = {
      method: 'DELETE',
      headers: this.headers,
    };
    const response = await fetch(url, options);
    const result = await response.json();
    return this.parseResponse(response, result);
  }

  async get(url) {
    this.headers.set('Authorization', Storage.getSessionAttr('token'));
    let options = {
      method: 'GET',
      headers: this.headers,
    };
    const response = await fetch(url, options);
    const result = await response.json();
    return this.parseResponse(response, result);
  }

  async post(url, data) {
    this.headers.set('Authorization', Storage.getSessionAttr('token'));
    let options = {
      method: 'POST',
      body: data ? JSON.stringify(data) : '',
      headers: this.headers,
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return this.parseResponse(response, result);
  }

  async put(url, data) {
    this.headers.set('Authorization', Storage.getSessionAttr('token'));
    let options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.headers,
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return this.parseResponse(response, result);
  }

  // post file requires a FormData object to be posted
  async postFile(url, formData) {
    // Headers have got to be redefined
    let headers = new Headers();
    headers.append('Authorization', Storage.getSessionAttr('token'));
    let options = {
      method: 'POST',
      headers: headers,
      body: formData,
    };

    const request = new Request(url, options);
    const response = await fetch(request);
    const result = await response.json();
    return this.parseResponse(response, result);
  }

  // Verifies response statuses and define proper data format
  parseResponse(response, result) {
    // Any status differnt from success, unauthorized or business logic error,
    // is considered an internal error
    console.log('res='+response.status);
    if (
      (response.status < 200 || response.status > 299) &&
      response.status !== 401 &&
      response.status !== 400 &&
      response.status !== 403
    ) {
      Notifier.displayError(
        common.message.serverErrorTitle,
        common.message.serverError
      );
    }

    if ((response.status === 400) || (response.status === 403)) {
      Notifier.displayError(result.message, result.data);
    }

    // When Unauthorized, redirect to the sso login URL
    if (response.status === 401) {
      const expireInHours = 1;
      Storage.setCookie(
        'referrer',
        document.location.href.split(document.location.origin)[1],
        expireInHours
      );
      let url = '/login';
      history.push(url);
    }

    // 200 are handled at the app level
    return {
      status: response.status,
      data: result.data,
      message: result.message,
    };
  }
}

decorate(Api, {
  redirectToLogin: observable,
  redirectCounter: observable,
});

export default new Api();
