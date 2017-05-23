/*
Author: Ashwath

*/
'use strict';
const parseDuration = require('parse-duration');
const _ = require('lodash');
const lrucacheprovider = require('../cacheprovider/lru');
const options = {
    maxAge: parseDuration(process.env.QUERY_CACHE_DURATION|| '1h'), //cache purges every 1 hr.
};

class MemObjects {
  constructor(cacheprovider){
    this.resShardCollection = {};
    this.walkResources('../models');
    this.cache = new cacheprovider(options);
  }

  loadResources() {
    // Can be a intensive op depending upon data size. 

    /*
      For effectively sharded DBs, it is possible to store the entire shard in memory, retrievals are faster and avoids roundtrip
      but suffer from staleness, an effecient purge option is needed.
    */
    _.forEach(Object.keys(this.resShardCollection), key => {
      if(!this.cache.has(key)){
        this.cache.set(key, require(this.resShardCollection[key]));
      }
    });
  }

  resourceDoesExist(name) {
    if(this.resShardCollection[name]) {
      return true;
    }
    return false;
  }

  getResource(resName){
    // return from cache, stop a round trip to DB.
    if(this.cache.has(resName)){
      return this.cache.get(resName);
    }
    // Select * the whole sharded table into memory
    const res = require(this.resShardCollection[resName]);
    this.cache.set(resName, res);
    return res;
  }
  
  walkResources(dir) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(`${__dirname}/${dir}`);
    let self = this;
    files.forEach(function(file) {
      let fName = file.replace(".json", "");
      self.resShardCollection[fName] = `${dir}/${file}`;
    });
  }
};

module.exports = new MemObjects(lrucacheprovider);