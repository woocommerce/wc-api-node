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

## Arguments

|   Params   |    Type    |                         Description                          |
|------------|------------|--------------------------------------------------------------|
| `endpoint` | `String`   | WooCommerce API endpoint, example: `customers` or `order/12` |
| `data`     | `Object`   | [optional] JS object, will be auomatically converted as query string or json body              |

## Methods

- get
- post
- put
- delete
- options

Every method **returns a promise**.

## Usage

Let's get the latest 5 published products priced less than 1[your currency]:

```js
// Define a query à la WP_Query
var _query = {
  per_page: '5',
  status: 'publish',
  filter: { // nested query strings are allowed and correctly handled
    meta_query: [
      {
        key: '_regular_price',
        value: '0.99',
        compare: '<=',
        type: 'numeric'
      }
    ]
  }
};
WooCommerce.get('products', _query)
.then(function(result) { // http status code is 2xx
  // Get some info from headers
  console.log(result.headers['X-Powered-By']);

  // The query returned at least one result
  if ( result.body.length ) {
    console.log(result.body); // response is automatically parsed to JS object
  }

  // No results found
  console.log('no results for this query, try another one');
})
.catch(function(error) { // API call failed
  console.log(error); // `error` is a js error object
})
.finally(function() {
  return 'Operation finished whether or not it was successfull';
});
```

## Release History

- 2016-06-39 - v1.4.0 - Added `wpAPIPrefix` option to allow custom WP REST API Url prefix and support for promified methods.
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
