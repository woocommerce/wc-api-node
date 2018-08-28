var WooCommerce = require('./index.js');
var chai = require('chai');
var nock = require('nock');
var Agent = require('http').Agent;
var HttpsAgent = require('https').Agent;
var agent = new Agent();
var httpsAgent = new HttpsAgent();

describe('#Construct', function() {
  it('should throw an error if the url, consumerKey or consumerSecret are missing', function() {
    chai.expect(function() {
      new WooCommerce();
    }).to.throw(Error);
  });

  it('should set the default options', function() {
    var api = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      wpAPI: true,
      version: 'wc/v1',
      agent: agent
    });

    chai.expect(api.version).to.equal('wc/v1');
    chai.expect(api.isSsl).to.be.false;
    chai.expect(api.verifySsl).to.be.true;
    chai.expect(api.encoding).to.equal('utf8');
    chai.expect(api.agent).to.equal(agent);
  });
});

describe('#Requests', function() {
  beforeEach(function() {
    nock.cleanAll();
  });

  var api = new WooCommerce({
    url: 'https://test.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v1',
    agent: httpsAgent
  });

  it('should return full API url', function() {
    var endpoint = 'products';
    var expected = 'https://test.dev/wp-json/wc/v1/products';
    var url      = api._getUrl(endpoint);

    chai.assert.equal(url, expected);
  });

  it('should return full WP REST API url with a custom path', function() {
    var restApi = new WooCommerce({
      url: 'https://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      wpAPI: true,
      wpAPIPrefix: 'wp-rest',
      version: 'wc/v1',
      agent: httpsAgent
    });

    var endpoint = 'products';
    var expected = 'https://test.dev/wp-rest/wc/v1/products';
    var url      = restApi._getUrl(endpoint);

    chai.assert.equal(url, expected);
  });

  it('should return sorted by name query string', function() {
    var url        = 'http://test.dev/wp-json/wc/v1/products?filter[q]=Woo+Album&fields=id&filter[limit]=1';
    var expected   = 'http://test.dev/wp-json/wc/v1/products?fields=id&filter[limit]=1&filter[q]=Woo%20Album';
    var normalized = api._normalizeQueryString(url);

    chai.assert.equal(normalized, expected);
  });

  it('should return content for basic auth', function(done) {
    nock('https://test.dev/wp-json/wc/v1').post('/orders', {}).reply(200, {
      ok: true
    });

    api.post('orders', {}, function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for get requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').get('/orders').reply(200, {
      ok: true
    });

    api.get('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for put requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').put('/orders', {}).reply(200, {
      ok: true
    });

    api.put('orders', {}, function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for delete requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').delete('/orders').reply(200, {
      ok: true
    });

    api.delete('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for options requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').intercept('/orders', 'OPTIONS').reply(400);

    api.options('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return a promise for getAsync requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').get('/orders').reply(200, {
      ok: true
    });

    api.getAsync('orders').finally(function(data) {
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return a promise for postAsync requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').post('/orders', {}).reply(200, {
      ok: true
    });

    api.postAsync('orders', {}).finally(function(data) {
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return a promise for putAsync requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').put('/orders', {}).reply(200, {
      ok: true
    });

    api.putAsync('orders', {}).finally(function(data) {
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return a promise for deleteAsync requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').delete('/orders').reply(200, {
      ok: true
    });

    api.deleteAsync('orders').finally(function(data) {
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return a promise for optionsAsync requests', function(done) {
    nock('https://test.dev/wp-json/wc/v1').intercept('/orders', 'OPTIONS').reply(400);

    api.optionsAsync('orders').finally(function(data) {
      chai.expect(data).be.a.string;
      done();
    });
  });

  it('should return content for OAuth', function(done) {
    var oAuth = new WooCommerce({
      url: 'http://test.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      wpAPI: true,
      version: 'wc/v1'
    });

    nock('http://test.dev/wp-json/wc/v1').filteringPath(/\?.*/, '?params').get('/orders?params').reply(200, {
      ok: true
    });

    oAuth.get('orders', function(err, data) {
      chai.expect(err).to.not.exist;
      chai.expect(data).be.a.string;
      done();
    });
  });
});
