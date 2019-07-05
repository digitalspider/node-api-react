class Storage {
  setCookie(cookieName, cookieValue, expireInHours) {
    if (this.getCookie(cookieName) === null) {
      let date = new Date();
      date.setTime(date.getTime() + (expireInHours * 3600 * 1000));
      let expires = '; expires=' + date.toGMTString();
      document.cookie = cookieName + '=' + cookieValue + expires + '; path=/;';
    }
  }

  getCookie(cookieName) {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
  }

  /**
   * Sets the user session in local storage under the key "session"
   * @param {Object} session - user data to be placed in the session key
   */
  setSession(session) {
    if (session) {
      window.localStorage.setItem('session', JSON.stringify(session));
    } else {
      this.removeSession();
    }
  }

  /**
   * Clears the "session" key from local storage
   */
  removeSession() {
    window.localStorage.removeItem('session');
  }

  /**
   * Retrieves the "session" key from local storage
   * @return {Object} data - session data
   */
  getSession() {
    return JSON.parse(window.localStorage.getItem('session'));
  }

  /**
   * Retrieves the value of a given attribute from
   * the "session" key in local storage
   * @param {String} attr - name of the attribute
   * @return {Object|String|Boolean} attr - the value of the attribute.
   * If not found, the value returned is false.
   */
  getSessionAttr(attr) {
    let session = window.localStorage.getItem('session');
    if (session !== null) {
      let sessionData = JSON.parse(session);
      return attr in sessionData ? sessionData[attr] : null;
    }
    return false;
  }
}

export default new Storage();
