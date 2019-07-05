import moment from 'moment';

/**
 * Get {@link #getBaseUrl()} and append environment property
 * REACT_APP_API_URL_PATH to it.
 * @param {String} hostname - the value of window.location.hostname
 * @param {String} baseUrl - if this is blank will get domain value
 * @param {String} apiPath - the path to append to the baseUrl
 * @return {String} the url of the apis
 */
export function getBaseApiUrl(
    hostname = window.location.hostname,
    baseUrl = process.env.REACT_APP_BASE_URL,
    apiPath = process.env.REACT_APP_API_URL_PATH
) {
  return [getBaseUrl(hostname, baseUrl), apiPath].join('');
}

/**
 * Return the value of environment property REACT_APP_BASE_URL
 * If this value is blank return the value protocol+'://'+hostname.
 * @param {String} hostname - the value of window.location.hostname
 * @param {String} baseUrl - if this is blank will get domain value
 * @return {String} the baseUrl of the application
 */
export function getBaseUrl(
    hostname = window.location.hostname,
    baseUrl = process.env.REACT_APP_BASE_URL,
) {
  if (baseUrl) {
    return baseUrl;
  }
  return window.location.protocol+'//'+hostname;
}


export function formatDate(date, format) {
  return date ? moment(date).format(format) : 'N/A';
}
