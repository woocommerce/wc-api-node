# WooCommerce API - Node.js Client

A Node.js wrapper for the WooCommerce REST API. Easily interact with the WooCommerce REST API using this library.

[![build status](https://secure.travis-ci.org/woothemes/wc-api-node.svg)](http://travis-ci.org/woothemes/wc-api-node)
[![dependency status](https://david-dm.org/woothemes/wc-api-node.svg)](https://david-dm.org/woothemes/wc-api-node)
[![npm version](https://img.shields.io/npm/v/woocommerce-api.svg)](https://www.npmjs.com/package/woocommerce-api)

## Installation

```
npm install --save woocommerce-api
```

## Getting started

Generate API credentials (Consumer Key & Consumer Secret) following this instructions <http://docs.woothemes.com/document/woocommerce-rest-api/>
.

Check out the WooCommerce API endpoints and data that can be manipulated in <http://woothemes.github.io/woocommerce-rest-api-docs/>.

## Setup

Setup for the old WooCommerce API v3:

```js
var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
  url: 'http://example.com',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});
```

Setup for the new WP REST API integration (WooCommerce 2.6 or later):

```js
var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
  url: 'http://example.com',
  wpAPI: true,
  wpAPIPath: 'wp-rest/', // [optional] the wp rest api path, defaults to 'wp-json/'
  version: 'wc/v1',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});
```

### Options

|       Option      |    Type   | Required |                                               Description                                                |
|-------------------|-----------|----------|----------------------------------------------------------------------------------------------------------|
| `url`             | `String`  | yes      | Your Store URL, example: http://woo.dev/                                                                 |
| `consumerKey`     | `String`  | yes      | Your API consumer key                                                                                    |
| `consumerSecret`  | `String`  | yes      | Your API consumer secret                                                                                 |
| `wpAPI`           | `Bool`    | no       | Allow requests to the WP REST API (WooCommerce 2.6 or later)                                             |
| `wpAPIPrefix`     | `String`  | no       | Custom WP REST API URL prefix, used to support custom prefixes created with the `rest_url_prefix` filter |
| `version`         | `String`  | no       | API version, default is `v3`                                                                             |
| `verifySsl`       | `Bool`    | no       | Verify SSL when connect, use this option as `false` when need to test with self-signed certificates      |
| `encoding`        | `String`  | no       | Encoding, default is 'utf-8'                                                                             |
| `queryStringAuth` | `Bool`    | no       | When `true` and using under HTTPS force Basic Authentication as query string, default is `false`         |
| `port`            | `string`  | no       | Provive support for URLs with ports, eg: `8080`                                                          |
| `timeout`         | `Integer` | no       | Define the request timeout                                                                               |

## Methods

|   Params   |    Type    |                         Description                          |
| ---------- | ---------- | ------------------------------------------------------------ |
| `endpoint` | `String`   | WooCommerce API endpoint, example: `customers` or `order/12` |
| `data`     | `Object`   | JS object, will be converted to JSON                         |
| `callback` | `Function` | Callback function. Returns `err`, `data` and `res`           |

### GET

- `.get(endpoint)`
- `.get(endpoint, callback)`

### POST

- `.post(endpoint, data)`
- `.post(endpoint, data, callback)`

### PUT

- `.put(endpoint, data)`
- `.put(endpoint, data, callback)`

### DELETE

- `.delete(endpoint)`
- `.delete(endpoint, callback)`

### OPTIONS

- `.options(endpoint)`
- `.options(endpoint, callback)`

## Promified Methods

Every method can be used in a promified way just adding `Async` to the method name. Like in:

```js
WooCommerce.getAsync('products').then(function(result) {
  return JSON.parse(result.toJSON().body);
});
```

## Release History

- 2016-06-09 - v1.3.2 - Fixed oAuth signature for WP REST API.
- 2016-06-08 - v1.3.1 - Fixed README.md.
- 2016-06-03 - v1.3.0 - Added new `timeout` option and updated dependencies.
- 2016-05-09 - v1.2.0 - Added support for WP REST API and added method to do HTTP OPTIONS requests.
- 2016-03-18 - v1.1.1 - Added support for ports.
- 2016-02-22 - v1.1.0 - Added `queryStringAuth` option to allow Basic Authentication as query string.
- 2015-12-07 - v1.0.4 - Updated dependencies and fixed brackets when sorting query string.
- 2015-12-07 - v1.0.3 - Added method to properly sort query strings when using oAuth.
- 2015-07-11 - v1.0.2 - Fixed the examples on example.js and README.md.
- 2015-07-11 - v1.0.1 - Added unit tests, improved the main class and added full description on README.md.
- 2015-07-11 - v1.0.0 - Initial release.
