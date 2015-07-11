# WooCommerce API - Node.js Client

A Node.js wrapper for the WooCommerce REST API. Easily interact with the WooCommerce REST API using this library.

[![build status](https://secure.travis-ci.org/woothemes/wc-api-node.svg)](http://travis-ci.org/woothemes/wc-api-node)
[![dependency status](https://david-dm.org/woothemes/wc-api-node.svg)](https://david-dm.org/woothemes/wc-api-node)

## Installation

```
npm install --save woocommerce-api
```

## Getting started

Generate API credentials (Consumer Key & Consumer Secret) following this instructions <http://docs.woothemes.com/document/woocommerce-rest-api/>
.

Check out the WooCommerce API endpoints and data that can be manipulated in <http://woothemes.github.io/woocommerce-rest-api-docs/>.

## Setup

```js
var WooCommerceAPI = require('WooCommerceAPI');

var WooCommerce = new WooCommerceAPI({
  url: 'http://example.com',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});
```

### Options

|      Option      |   Type   | Required |                                             Description                                             |
| ---------------- | -------- | -------- | --------------------------------------------------------------------------------------------------- |
| `url`            | `String` | yes      | Your Store URL, example: http://woo.dev/                                                            |
| `consumerKey`    | `String` | yes      | Your API consumer key                                                                               |
| `consumerSecret` | `String` | yes      | Your API consumer secret                                                                            |
| `version`        | `String` | no       | API version, default is `v3`                                                                        |
| `verifySsl`      | `Bool`   | no       | Verify SSL when connect, use this option as `false` when need to test with self-signed certificates |
| `encoding`       | `String` | no       | Encoding, default is 'utf-8'                                                                        |

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

## Release History

- 2015-07-11 - v1.0.1 - Added unit tests, improved the main class and added full description on README.md.
- 2015-07-11 - v1.0.0 - Initial release.
