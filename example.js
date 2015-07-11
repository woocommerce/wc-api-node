'use strict';

var API = require('./woocommerce-api.js'); // use require('WooCommerceAPI')

// Initialize the WooCommerceAPI class
var WooCommerce = new API({
  url: 'http://example.com', // Your store url (required)
  // version: 'v3', // WooCommerce API version (optional)
  // verifySsl: true, // Use `false` when need test with self-signed certificates, default is `true` (optional)
  // encoding: 'utf8', // Encode, default is 'utf8' (optional)
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Your API consumer key (required)
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // Your API consumer secret (required)
});

// GET example
WooCommerce.get('customers', function(err, data, res) {
  console.log(res);
});

// POST example
// WooCommerce.post('products', {
//   product: {
//     title: 'Premium Quality',
//     type: 'simple',
//     regular_price: '21.99'
//   }
// }, function(err, data, res) {
//   console.log(res);
// });

// PUT example
// WooCommerce.put('orders', {
//   order: {
//     status: 'completed'
//   }
// }, function(err, data, res) {
//   console.log(res);
// });

// Delete example
// WooCommerce.delete('coupons/123', function(err, data, res) {
//   console.log(res);
// });
