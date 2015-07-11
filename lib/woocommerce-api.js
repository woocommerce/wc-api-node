'use strict';

module.exports = WooCommerceAPI;

var request = require('request');
var OAuth   = require('oauth-1.0a');

/**
 * WooCommerce REST API wrapper
 *
 * @param {Object} opt
 */
function WooCommerceAPI(opt) {
  if (!(this instanceof WooCommerceAPI)) {
    return new WooCommerceAPI(opt);
  }

  if (!(opt.url)) {
    throw new Error('url is required');
  }

  if (!(opt.consumerKey)) {
    throw new Error('consumerKey is required');
  }

  if (!(opt.consumerSecret)) {
    throw new Error('consumerSecret is required');
  }

  this.classVersion = '1.0.0';
  this.setDefaults(opt);
}

/**
 * Set default arguments
 *
 * @param {Object} opt
 */
WooCommerceAPI.prototype.setDefaults = function(opt) {
  this.url            = opt.url;
  this.version        = opt.version || 'v3';
  this.isSsl          = /^https/i.test(this.url);
  this.consumerKey    = opt.consumerKey;
  this.consumerSecret = opt.consumerSecret;
  this.verifySsl      = false === opt.verifySsl ? false : true;
}

/**
 * Get URL
 *
 * @param  {String} endpoint
 *
 * @return {String}
 */
WooCommerceAPI.prototype._getUrl = function(endpoint) {
  var url = '/' === this.url.slice(-1) ? this.url : this.url + '/';

  return url + 'wc-api/' + this.version + '/' + endpoint;
}

/**
 * Get OAuth
 *
 * @return {Object}
 */
WooCommerceAPI.prototype._getOAuth = function() {
  return new OAuth({
    consumer: {
      public: this.consumerKey,
      secret: this.consumerSecret
    },
    signature_method: 'HMAC-SHA256'
  });
}

/**
 * Do requests
 *
 * @param  {String}   method
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype._request = function(method, endpoint, callback) {
  var url = this._getUrl(endpoint);

  var data = {
    url: url,
    method: method,
    headers: {
      'User-Agent': 'WooCommerceAPI-Node/' + this.classVersion,
    }
  };

  if (this.isSsl) {
    data.auth = {
      user: this.consumerKey,
      pass: this.consumerSecret
    }
    if (!this.verifySsl) {
      data.strictSSL = false;
    }
  } else {
    data.qs = this._getOAuth().authorize({
      url: url,
      method: method,
    });
  }

  if (!callback) {
    return request(data);
  }

  return request(data, callback);
}

/**
 * Get requests
 *
 * @param  {String}   endpoint
 * @param  {Function} callback
 *
 * @return {Object}
 */
WooCommerceAPI.prototype.get = function(endpoint, callback) {
  return this._request('GET', endpoint, callback);
};
