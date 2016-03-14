'use strict';

var request = require('request');
var OAuth   = require('oauth-1.0a');
var _url    = require('url');

module.exports = WooCommerceAPI;

/**
 * WooCommerce REST API wrapper
 *
 * @param {Object} opt
 */
function WooCommerceAPI(opt) {
  if (!(this instanceof WooCommerceAPI)) {
    return new WooCommerceAPI(opt);
  }

  opt = opt || {};

  if (!(opt.url)) {
    throw new Error('url is required');
  }

  if (!(opt.consumerKey)) {
    throw new Error('consumerKey is required');
  }

  if (!(opt.consumerSecret)) {
    throw new Error('consumerSecret is required');
  }

  this.classVersion = '1.1.0';
  this._setDefaultsOptions(opt);
}

/**
 * Set default options
 *
 * @param {Object} opt
 */
WooCommerceAPI.prototype._setDefaultsOptions = function(opt) {
  this.url             = opt.url;
  this.version         = opt.version || 'v3';
  this.isSsl           = /^https/i.test(this.url);
  this.consumerKey     = opt.consumerKey;
  this.consumerSecret  = opt.consumerSecret;
  this.verifySsl       = false === opt.verifySsl ? false : true;
  this.encoding        = opt.encoding || 'utf8';
  this.queryStringAuth = opt.queryStringAuth || false;
  this.proxy           = opt.proxy || false;
};

/**
 * Normalize query string for oAuth
 *
 * @param  {string} url
 * @return {string}
 */
WooCommerceAPI.prototype._normalizeQueryString = function(url) {
  // Exit if don't find query string
  if (-1 === url.indexOf('?')) {
    return url;
  }

  var query       = _url.parse(url, true).query;
  var params      = [];
  var queryString = '';

  for (var p in query) {
    params.push(p);
  }
  params.sort();

  for (var i in params) {
    if (queryString.length) {
      queryString += '&';
    }

    queryString += encodeURIComponent(params[i]).replace('%5B', '[').replace('%5D', ']');
    queryString += '=';
    queryString += encodeURIComponent(query[params[i]]);
  }

  return url.split('?')[0] + '?' + queryString;
};

/**
 * Get URL
 *
 * @param  {String} endpoint
 *
 * @return {String}
 */
WooCommerceAPI.prototype._getUrl = function(endpoint) {
  var url = '/' === this.url.slice(-1) ? this.url : this.url + '/';
  url = url + 'wc-api/' + this.version + '/' + endpoint;

  if (!this.isSsl) {
    return this._normalizeQueryString(url);
  }

  return url;
};

/**
 * Get OAuth
 *
 * @return {Object}
 */
WooCommerceAPI.prototype._getOAuth = function() {
  var data = {
    consumer: {
      public: this.consumerKey,
      secret: this.consumerSecret
    },
    signature_method: 'HMAC-SHA256'
  };

  if ('v3' !== this.version) {
    data.last_ampersand = false;
  }

  return new OAuth(data);
};

/**
 * Do requests
 *
 * @param  {String}   method
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype._request = function(method, endpoint, data, callback) {
  var url = this._getUrl(endpoint);

  var params = {
    url: url,
    method: method,
    encoding: this.encoding,
    headers: {
      'User-Agent': 'WooCommerce API Client-Node.js/' + this.classVersion,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (this.isSsl) {
    if (this.queryStringAuth) {
      params.qs = {
        consumer_key: this.consumerKey,
        consumer_secret: this.consumerSecret
      };
    } else {
      params.auth = {
        user: this.consumerKey,
        pass: this.consumerSecret
      };
    }

    if (!this.verifySsl) {
      params.strictSSL = false;
    }
  } else {
    params.qs = this._getOAuth().authorize({
      url: this.proxy ? this.proxy : url,
      method: method
    });
  }

  if (data) {
    params.body = JSON.stringify(data);
  }

  if (!callback) {
    return request(params);
  }

  return request(params, callback);
};

/**
 * GET requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.get = function(endpoint, callback) {
  return this._request('GET', endpoint, null, callback);
};

/**
 * POST requests
 *
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.post = function(endpoint, data, callback) {
  return this._request('POST', endpoint, data, callback);
};

/**
 * PUT requests
 *
 * @param  {String}   endpoint
 * @param  {Object}   data
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.put = function(endpoint, data, callback) {
  return this._request('PUT', endpoint, data, callback);
};

/**
 * DELETE requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.delete = function(endpoint, callback) {
  return this._request('DELETE', endpoint, null, callback);
};
