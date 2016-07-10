'use strict';

var WooCommerceAPI = require('./index.js'); // use require('woocommerce-api')

// Initialize the WooCommerceAPI class
var WooCommerce = new WooCommerceAPI({
  url: 'http://example.com', // Your store url (required)
  // version: 'v3', // WooCommerce API version (optional)
  // verifySsl: true, // Use `false` when need test with self-signed certificates, default is `true` (optional)
  // encoding: 'utf8', // Encode, default is 'utf8' (optional)
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Your API consumer key (required)
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' // Your API consumer secret (required)
});

// GET example
WooCommerce.get('customers').then(function(res) {
  console.log(res);
}).catch(function(err) {
  console.log(err);
});

// alternative syntax
// WooCommerce.get('customers').then(function(res) {
//   console.log(res);
// }, function(err) {
//   console.log(err);
// });

// callback style
// WooCommerce.get( 'customers' ).promise().asCallback( function(err, data) {
//   if ( err ) {
//     console.warn(err);
//   }
//   else {
//     console.log(data);
//   }
// });

// POST example
// WooCommerce.post('products', {
//   product: {
//     title: 'Premium Quality',
//     type: 'simple',
//     regular_price: '21.99'
//   }
// )
// .then(function(res) {
//   console.log(res);
// });

// PUT example
// WooCommerce.put('orders/123', {
//   order: {
//     status: 'completed'
//   }
// }).then(function(res) {
//   console.log(res);
// });

// Delete example
// WooCommerce.delete('coupons/123').then(function(res) {
//   console.log(res);
// });
