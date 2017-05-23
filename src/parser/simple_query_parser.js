/*
Author: Ashwath

*/
const _ = require('lodash');

function isArrayAsString(str) {
  if(str.indexOf("[") === 0) {
    return true;
  }
  return false;
}

function hasMultipleValuesinString(str) {
  if(str.indexOf(",") !== -1) {
    return true;
  }
  return false;
}

module.exports = {
  tokenize: (qs) => {
    this.op = {};
    this.fields = {};
    let expressions = [].concat(_.trim(qs));
    if(qs.indexOf(' AND ') != -1) {
      expressions = qs.split(' AND ');
      this.op.and = true;
    } else if(qs.indexOf(' OR ') != -1) {
      expressions = qs.split(' OR ');
      this.op.or = true;
    }
    var self = this;
    _.forEach(expressions, (item) => {
      // Make a dictionary of the fields and values.
      let kv = item.split('=');
      let k = _.trim(kv[0]);
      let v = _.trim(kv[1]);
      v = hasMultipleValuesinString(v) ? v.split(",") : v;
      v = isNaN(v) ? v : +v;
      v = v === 'true' ? true : (v === 'false' ? false : v);

      self.fields[k] = v;
    });
    return { op: this.op, fields: this.fields}
  }
}