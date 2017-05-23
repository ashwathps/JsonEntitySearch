/*
Author: Ashwath

*/
const jsonQuery = require('json-query');
const parseDuration = require('parse-duration');
const readline = require('readline');

const lruProvider = require('./cacheprovider/lru');
const ResourceController = require('./controller/res_controller');
const MemObjects = require('./datacache/mem_objects');
const ResourceBuilder = require('./res_builder');
const Formatter = require('./results/query_result_formatter');

var rline = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const options = {
    maxAge: parseDuration(process.env.QUERY_CACHE_DURATION|| '5m'), //cache purges every 5 mins.
};
var lruCache = new lruProvider(options);

var string_formatter = new Formatter();
var formats = "search <resource> where <\"double quoted where clause\"> \n";
formats += "Eg: search tickets where \"description=''\" \n";
formats += "Eg: search organizations where \"shared_tickets=true\" \n";
formats += "Eg: search users where \"suspended=true OR tags=Sutton,Springville\" \n";

var recursiveSearchOptionCli = function () {
  rline.question(`\nSearch entities using Ash's Query Language (AQL). \nValid formats: ${formats}\n \n Query> `, function(qs){
    if(qs === "" || qs == undefined) {
      return recursiveSearchOptionCli();
    }
    var reg = /^search\s+(.*)\s+where\s+(".*?"$)/i;
    var matches = qs.match(reg);
    if(!matches) {
      console.log('Invalid query format, please see examples.');
      return recursiveSearchOptionCli();
    }
    if(!MemObjects.resourceDoesExist(matches[1])){
      console.log('No such resource to search on, try again.');
      return recursiveSearchOptionCli();
    }
    let rc = new ResourceController(lruCache, matches[1]);
    let res = rc.queryResults(matches[2].replace(new RegExp('"', 'g'), ''));

    let rb = new ResourceBuilder(lruCache);
    res = rb.getRelatedEntities(res, matches[1]);
    // THis is the reporting logic, need to know what the reporter is reporting on.
    if(matches[1].toLowerCase() === 'users') {
      console.log(string_formatter.friendlifyUser(res));
    }else if(matches[1].toLowerCase() === 'organizations') {
      console.log(string_formatter.friendlifyOrgs(res));
    }
    else if(matches[1].toLowerCase() === 'tickets') {
      console.log(string_formatter.friendlifyTickets(res));
    }
    recursiveSearchOptionCli();
  });
};
recursiveSearchOptionCli();