'use strict';

const chai = require('chai')
    , spies = require('chai-spies');

require('should');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const assert = chai.assert;
const expect = chai.expect;


chai.use(spies);
chai.use(chaiAsPromised);

const resourceController = require('../../src/controller/res_controller');
const cacheStubs = {};

describe('Resource controller', function() {

  beforeEach(() => {
    cacheStubs.has = sinon.stub().returns(true);
    cacheStubs.get = sinon.stub().returns("value");
    cacheStubs.set = sinon.stub().returns(true);
  });

   describe('Initialization', function() {

     it('should initialize correctly', function() {
      var obj = new resourceController( cacheStubs, "users");
      assert.property(obj, 'resourceName');
      assert.propertyVal(obj, 'resourceName', 'users');
     });

     it('should initialize correctly', function() {
      var obj = new resourceController( cacheStubs, "users");
      assert.property(obj, 'resourceName');
      assert.propertyVal(obj, 'resourceName', 'users');
     });

     it('should return from cache correctly', function() {
      var obj = new resourceController( cacheStubs, "users");
      assert.property(obj, 'resourceName');
      assert.propertyVal(obj, 'resourceName', 'users');

      obj.queryResults("qs");
      cacheStubs.has.callCount.should.equal(1);
      cacheStubs.get.callCount.should.equal(1);
     });
   });

   describe('User entity query', function() {
     it('should return results correctly', function() {
      var obj = new resourceController( cacheStubs, "users");
      assert.property(obj, 'resourceName');
      assert.propertyVal(obj, 'resourceName', 'users');

       //override
      cacheStubs.has = sinon.stub().returns(false);

      var results = obj.queryResults("suspended=true OR tags=Sutton,Springville");
      cacheStubs.has.callCount.should.equal(1);
      cacheStubs.get.callCount.should.equal(0);

      expect(results).to.have.length.of.at.least(36);
     });

     it('should return appropiate log for bad query string', function() {
      var obj = new resourceController( cacheStubs, "users");
      assert.property(obj, 'resourceName');
      assert.propertyVal(obj, 'resourceName', 'users');

       //override
      cacheStubs.has = sinon.stub().returns(false);

      var results = obj.queryResults("suspend=true OR tags=Sutton,Springville");
      cacheStubs.has.callCount.should.equal(1);
      cacheStubs.get.callCount.should.equal(0);

      expect(results).to.be.undefined;
     });

  });

});