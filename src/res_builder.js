/*
Author: Ashwath

*/

const _ = require('lodash');

// A simple relationship graph for connecting related entities
// Look at it like blend of PK, FK relationship & GraphDB
const entityGraph = require('./graph/config.json');
const ResourceController = require('./controller/res_controller');

class ResourceBuilder {
  constructor(cacheprovider) {
    this.cacheprovider = cacheprovider;
  }
  // Creates the required query to further extend the relationships of the payload
  // based on the relationship mapper config.
  getRelatedEntities(data, source_res) {
    let rel_root = entityGraph[source_res];
    if(!rel_root) return data; //if no relationships are defined in the config, return the data as-is

    _.forEach(Object.keys(rel_root), (entityname) => {
      let entity = rel_root[entityname];
      let srcField = entity.joinWith;
      let destField = entity.joinOn;

      let rc = new ResourceController(this.cacheprovider, entityname);
      _.forEach(data, (d) => {
        d._relations_ = d._relations_ || {};
        if(Array.isArray(destField)) {
          let val = d[srcField];
          d._relations_[entityname] = rc.queryResults(`${destField[0]}=${val} OR ${destField[1]}=${val}`);
        } else {
          d._relations_[entityname] = rc.queryResults(`${destField}=${d[srcField]}`);
        }
      });
    });
    return data;
  }
}

module.exports = ResourceBuilder;