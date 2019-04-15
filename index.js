'use strict';

var request = require('request');
var OAuth   = require('oauth-1.0a');
var crypto  = require('crypto');
var promise = require('bluebird');
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

  this.classVersion = '1.4.2';
  this._setDefaultsOptions(opt);
}

/**
 * Set default options
 *
 * @param {Object} opt
 */
WooCommerceAPI.prototype._setDefaultsOptions = function(opt) {
  this.url             = opt.url;
  this.wpAPI           = opt.wpAPI || false;
  this.wpAPIPrefix     = opt.wpAPIPrefix || 'wp-json';
  this.wcVersion       = opt.wcVersion || 'wc/v3';
  this.wpVersion       = opt.wpVersion || 'wp/v2';
  this.isSsl           = /^https/i.test(this.url);
  this.consumerKey     = opt.consumerKey;
  this.consumerSecret  = opt.consumerSecret;
  this.verifySsl       = false === opt.verifySsl ? false : true;
  this.encoding        = opt.encoding || 'utf8';
  this.queryStringAuth = opt.queryStringAuth || false;
  this.port            = opt.port || '';
  this.timeout         = opt.timeout;
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

    queryString += encodeURIComponent(params[i]).replace('%5B', '[')
      .replace('%5D', ']');
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
WooCommerceAPI.prototype._getUrl = function(endpoint, isWP) {
  var url = '/' === this.url.slice(-1) ? this.url : this.url + '/';
  var api = this.wpAPI ? this.wpAPIPrefix + '/' : 'wc-api/';
  var version = isWP ? this.wpVersion : this.wcVersion;

  url = url + api + version + '/' + endpoint;

  // Include port.
  if ('' !== this.port) {
    var hostname = _url.parse(url, true).hostname;
    url = url.replace(hostname, hostname + ':' + this.port);
  }

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
      key: this.consumerKey,
      secret: this.consumerSecret
    },
    signature_method: 'HMAC-SHA256',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string)
          .digest('base64');
    }
  };

  if (-1 < [ 'v1', 'v2' ].indexOf(this.wcVersion)) {
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
 * @param  {Bool} isWP
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype._request = function(method, endpoint, data, isWP, callback) {
  var url = this._getUrl(endpoint, isWP);

  var params = {
    url: url,
    method: method,
    encoding: this.encoding,
    timeout: this.timeout,
    headers: {
      'User-Agent': 'WooCommerce API Client-Node.js/' + this.classVersion,
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
      url: url,
      method: method
    });
  }

  if (data) {
    params.headers['Content-Type'] = 'application/json;charset=utf-8';
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
WooCommerceAPI.prototype.get = function(endpoint, isWP=false, callback) {
  return this._request('GET', endpoint, null, isWP, callback);
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
WooCommerceAPI.prototype.post = function(endpoint, data, isWP=false, callback) {
  return this._request('POST', endpoint, data, isWP, callback);
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
WooCommerceAPI.prototype.put = function(endpoint, data, isWP=false, callback) {
  return this._request('PUT', endpoint, data, isWP, callback);
};

/**
 * DELETE requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.delete = function(endpoint, isWP=false, callback) {
  return this._request('DELETE', endpoint, null, isWP, callback);
};

/**
 * OPTIONS requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.options = function(endpoint, isWP=false, callback) {
  return this._request('OPTIONS', endpoint, null, isWP, callback);
};

/**
 * Promifying all requests exposing new methods
 * named [method]Async like in getAsync()
 */
promise.promisifyAll(WooCommerceAPI.prototype);
