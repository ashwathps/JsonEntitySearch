/*
Author: Ashwath

*/

const _ = require('lodash');

class QueryRunner {

  constructor() {
    this.results = [];
  }

  iterate_and_search(search_space, search_fields, search_op) {
    let filteredObjects = [];
    let self = this;
    // Indexer will make query fast, TODO
    _.forEach(Object.keys(search_fields), (key) => {
      let matcher = { };
      let res = [];
      matcher[key] = search_fields[key];

      // User need not know that a field is an array, he is just searching.
      // Assumption: First data has full/correct structure.
      if(Array.isArray(search_space[0][key]) && !Array.isArray(matcher[key])) {
        matcher[key] = matcher[key].split(",");
      }
      if(matcher[key] === "''") {
        res = _.filter(search_space, (item) => {
          // hasPropertyOrEmptyPredicate
          if(!_.has(item, key)) {
            return true;
          }
          return false;
        });
      }
      // if the fields to search is an array, lodash cannot search. so, custom Predicate.
      else if(Array.isArray(matcher[key])) {
        res = _.filter(search_space, (item) =>{
          // array common predicate
          if(_.intersection(item[key], matcher[key]) <= 0 )
          {
            return false;
          }
          return true;
        });
      // Assumption: expect data TYPES to be consistent.
      } else {
        res = _.filter(search_space, _.matches(matcher));
      }

      if(search_op.or) {
        //remove discovered objects from 'search_space' object & reduce search space.
        _.pullAll(search_space, res);
        filteredObjects = filteredObjects.concat(res);
      }else {
        search_space = _.intersection(search_space, res);
        filteredObjects = search_space;
      }
    });
    return filteredObjects;
  }

  find(search_space, search_fields, search_op) {
    // if(search_op.and) {
    //   // AND operation or just a single query field
    //   this.results = _.filter(search_space, _.matches(search_fields));
    // }
    // else {
    this.results = this.iterate_and_search(search_space, search_fields, search_op);
    return this.results;
  }
}
module.exports = QueryRunner;