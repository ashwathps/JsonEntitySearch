/*
Author: Ashwath

This class must be looked as a reporting engine, alternative to reporting templates.
Something like a tableau / Kibana query template
A easier version but a bit clumsy due to all the string manipulation and interpolations.
*/

const _ = require('lodash');
const entityGraph = require('../graph/config.json');
class QueryResultFormatter {

  constructor(){

  }
  // A simple reporter/formatter. Could be extended
  friendlifyUser(json_data) {
    const begin_stmt = `There are ${json_data.length} users matching the query string. \n The users are:`;
    const line_sep = " ------------------------------------- \n";
    let search_results = "";
    let rel_root = entityGraph['users'];
    if(json_data.length == 0) return `${begin_stmt} ${line_sep}`;

    _.forEach(json_data, (item) => {
      let val = `${item['name']} with alias ${item['alias']} from ${item['timezone']}.`;
      if(item._relations_) {
        _.forEach(Object.keys(rel_root), key => {
          if(key.toLowerCase() === 'organizations' && item._relations_.organizations[0]) {
            val += ` Belongs to ${item._relations_.organizations[0].name} org.`;
          }
          else if(key.toLowerCase() === 'tickets' && item._relations_.tickets) {
            val += ` Has ${item._relations_[key].length} ticket/s in state ${rel_root[key].joinOn}`;
          }
        });
      }
      search_results = `${search_results} \n ${val}`;
    });
    return `${begin_stmt}${search_results} \n${line_sep}`;
  }

  friendlifyOrgs(json_data) {
    const begin_stmt = `There are ${json_data.length} orgs matching the query string. \n The orgs are:`;
    const line_sep = " ------------------------------------- \n";
    if(json_data.length == 0) return `${begin_stmt} ${line_sep}`;

    let search_results = "";
    let rel_root = entityGraph['organizations'];

    _.forEach(json_data, (item) => {
      let val = `${item['name']}, a ${item['details']} created at ${item['created_at']}.`;
      search_results = `${search_results} \n ${val}`;
    });
    return `${begin_stmt}${search_results}\n${line_sep}`;
  }

  friendlifyTickets(json_data) {
    const begin_stmt = `There are ${json_data.length} tickets matching the query string. \n The tickets are:`;
    const line_sep = " ------------------------------------- \n";
    if(json_data.length == 0) return `${begin_stmt} ${line_sep}`;

    let search_results = "";
    let rel_root = entityGraph['tickets'];

     _.forEach(json_data, (item) => {
      let val = `${item.type} ticket with subject: ${item.subject}.`;
      if(item._relations_) {
        _.forEach(Object.keys(rel_root), key => {
          if(key.toLowerCase() === 'organizations' && item._relations_.organizations[0]) {
            val += ` Belongs to ${item._relations_.organizations[0].name} org.`;
          }
        });
      }
      search_results = `${search_results} \n ${val}`;
    });
    return `${begin_stmt}${search_results} \n${line_sep}`;

  }
}

module.exports = QueryResultFormatter;