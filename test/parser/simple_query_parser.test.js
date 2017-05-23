'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;

chai.use(chaiAsPromised);
const parser = require('../../src/parser/simple_query_parser');

describe('Simple Query Parser', function() {

   describe('AND query', function() {
     it('handles logical AND expressions and return correct fields', function() {
      const ret = parser.tokenize("field=value AND field2=value2");

      assert.property(ret, 'op');
      assert.property(ret, 'fields');
     });

     it('handles logical AND expressions and return correct data', function() {
      const ret = parser.tokenize("field=value AND field2=''");
      assert.deepPropertyVal(ret, 'op.and', true);
      assert.deepPropertyVal(ret, 'fields.field', "value");
      assert.deepPropertyVal(ret, 'fields.field2', "''");
     });

     it('handles multiple values as array', function() {
      const ret = parser.tokenize("field=value AND field2=val1,val2,val3");
      assert.deepPropertyVal(ret, 'op.and', true);
      assert.deepPropertyVal(ret, 'fields.field', "value");

      assert.lengthOf(ret.fields.field2, 3);
     });
   });

   describe('OR query', function() {
     it('handles logical OR expressions and return correct fields', function() {
      const ret = parser.tokenize("field=value AND field2=value2");

      assert.property(ret, 'op');
      assert.property(ret, 'fields');
     });

     it('handles logical OR expressions and return correct data', function() {
      const ret = parser.tokenize("field=value OR field2=''");
      assert.notDeepProperty(ret, 'op.and', undefined);
      assert.deepPropertyVal(ret, 'op.or', true);
      assert.deepPropertyVal(ret, 'fields.field', "value");
      assert.deepPropertyVal(ret, 'fields.field2', "''");
     });

     it('handles number values as correctly', function() {
      const ret = parser.tokenize("field=value OR field2=1");
      assert.deepPropertyVal(ret, 'fields.field2', 1);
      assert.notStrictEqual(ret.fields.field2, '1');
     });

     it('handles boolean values as correctly', function() {
      const ret = parser.tokenize("field=value OR field2=true");
      assert.deepPropertyVal(ret, 'fields.field2', true);
      assert.notStrictEqual(ret.fields.field2, 'true');
     });

   });

   describe('OR and AND query', function() {
     it('does not handle logical OR and AND fields', function() {
      const ret = parser.tokenize("field=value OR field2=value2 AND field3=value3");

      assert.property(ret, 'op');
      assert.property(ret, 'fields');
      assert.deepPropertyVal(ret, 'fields.field', "value OR field2");
     });
   });

});