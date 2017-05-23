'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;

chai.use(chaiAsPromised);
const memObjects = require('../../src/datacache/mem_objects');

describe('DB shard in memory - memObjects', function() {

   describe('Initilization', function() {
     it('should initialize correctly', function() {

      assert.property(memObjects, 'resShardCollection');

     });

     it('should handle resource loading correctly', function() {
      let count = memObjects.cache.length
      assert.notEqual(count, 3);

      memObjects.loadResources();
      count = memObjects.cache.length
      assert.equal(count, 3);
     });
  });

  describe('Resource loading', function() {
     it('should cache lookup correctly', function() {
      memObjects.loadResources();
      let count = memObjects.cache.length
      assert.equal(count, 3);

      assert.equal(memObjects.resourceDoesExist('users'), true);
      assert.equal(memObjects.resourceDoesExist('organizations'), true);
      assert.equal(memObjects.resourceDoesExist('tickets'), true);
     });

     it('should get a resource from cache', function() {
      memObjects.loadResources();
      let count = memObjects.cache.length
      assert.equal(count, 3);

      assert.notEqual(memObjects.getResource('users'), undefined);
     });
     
  });
});