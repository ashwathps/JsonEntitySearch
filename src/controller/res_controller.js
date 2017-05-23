/*
Author: Ashwath

*/

const _ = require('lodash');
const sqp = require('../parser/simple_query_parser');
const memObjects = require('../datacache/mem_objects');
const qRunner = require('./query_runner');

class ResourceController {

  constructor(cacheprovider, resourcename) {
    this.queryCache = cacheprovider;
    this.qs = {op: {}, fields: {}};
    this.resourceName = resourcename;
    memObjects.loadResources();
  }

  validateQueryString(qs) {
    // allowed values in the qs field
    // Assumption: The first object in the database is the reference object for fields.
    // Seperate column family manager not in this scope.
    // 
    this.tokenizeQuery(qs);
    if( _.intersection(Object.keys(this.qs.fields), Object.keys(memObjects.getResource(this.resourceName)[0])).length !== Object.keys(this.qs.fields).length ) {
      return false;
    }
    return true;
  }

  tokenizeQuery(qs) {
    // poor man's logical expression evaluator
    let tokenizer = sqp.tokenize(qs);
    this.qs.op = tokenizer.op;
    this.qs.fields = tokenizer.fields;
    this.query_runner = new qRunner();
  }

  queryResults(qs) {
    // cache lookup
    if(this.queryCache.has(qs)) {
      return this.queryCache.get(qs);
    }
    //tokenize and retrieve fields from the query string
    if(!this.validateQueryString(qs)){
      console.log("Your query has fields that are not valid, please retry with correct fields");
      return;
    }
    let results = this.query_runner.find(memObjects.getResource(this.resourceName), this.qs.fields, this.qs.op );

    this.queryCache.set(qs, results);
    return results;
  }
}

module.exports = ResourceController;