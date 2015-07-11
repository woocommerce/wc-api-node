var WooCommerce = require('./woocommerce-api.js');
var should = require('chai').should();
var nock = require('nock');

describe('#Construct', function() {
  it('should throw an error if the url, consumerKey or consumerSecret are missing', function() {
    should.Throw(function() {
      new WooCommerce();
    }, Error);
  });

  it('should set the default options', function() {
    var api = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'foo',
      consumerSecret: 'foo'
    });

    api.version.should.equal('v3');
    api.isSsl.should.be.false;
    api.verifySsl.should.be.true;
    api.encoding.should.equal('utf8');
  });
});

describe('#Requests', function() {
  beforeEach(function() {
    nock.cleanAll();
  });

  var api = new WooCommerce({
    url: 'https://test.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  });

  it('should return content for basic auth', function(done) {
    nock('https://test.dev/wc-api/v3').post('/orders', {}).reply(200, {
      ok: true
    });

    api.post('orders', {}, function(err, data) {
      should.not.exist(err);
      data.should.be.a.string;
      done();
    });
  });

  it('should return content for get requests', function(done) {
    nock('https://test.dev/wc-api/v3').get('/orders').reply(200, {
      ok: true
    });

    api.get('orders', function(err, data) {
      should.not.exist(err);
      data.should.be.a.string;
      done();
    });
  });

  it('should return content for put requests', function(done) {
    nock('https://test.dev/wc-api/v3').put('/orders', {}).reply(200, {
      ok: true
    });

    api.put('orders', {}, function(err, data) {
      should.not.exist(err);
      data.should.be.a.string;
      done();
    });
  });

  it('should return content for delete requests', function(done) {
    nock('https://test.dev/wc-api/v3').delete('/orders').reply(200, {
      ok: true
    });

    api.delete('orders', function(err, data) {
      should.not.exist(err);
      data.should.be.a.string;
      done();
    });
  });

  it('should return content for OAuth', function(done) {
    var oAuth = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    });

    nock('http://test.dev/wc-api/v3').filteringPath(/\?.*/, '?params').get('/orders?params').reply(200, {
      ok: true
    });

    oAuth.get('orders', function(err, data) {
      should.not.exist(err);
      data.should.be.a.string;
      done();
    });
  });

});
