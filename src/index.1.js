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

//     let qs = `search tickets where "type=question"`;
//     // qs = 'search users where "suspended=true OR tags=Sutton,Springville"';
//     // qs = 'search organizations where "shared_tickets=\'\'"';
//   var reg = /^search\s+(.*)\s+where\s+(".*?"$)/i;
// var matches = qs.match(reg);


// if(!MemObjects.resourceDoesExist(matches[1])){
//   console.log('No such resource to search on.');
//   return recursiveSearchOptionCli();
// }
// let rc = new ResourceController(new lruProvider(options), matches[1]);
// let res = rc.queryResults(matches[2].replace(new RegExp('"', 'g'), ''));

// let rb = new ResourceBuilder(new lruProvider(options));
// res = rb.getRelatedEntities(res, matches[1]);
// var f = new formatter();

// //console.log(res);
// console.log(f.friendlifyTickets(res));
// console.log(f.friendlifyOrgs(res));
// console.log(f.friendlifyUser(res));

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
      console.log('No such resource to search on.');
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

/*
var testres = 'organizations';
if(!MemObjects.resourceDoesExist(testres)){
  console.log('No such resource to search on.');
  return;
}
console.log(`Searching ${testres}`);

const oc = new ResourceController(new lruProvider(options), 'organizations');
var resss = oc.queryResults("domain_names=endipin.com OR tags=Fulton,West");
ress = oc.queryResults("suspended=true OR tags=Sutton,Springville");


var db = {
  union: {
    organizations: organizations,
    users: users,
    tickets: tickets
  }
};

var result = jsonQuery('union[**][*tags=Virginia]', {data: db}).value;

console.log(result);


var argv = require('minimist')("-r <resource> -q 'field=value' -l 10");

*/

/*
search <resource> where "field=value" limit 10

search <resource>+ where "field=value AND " limit 10


list <resource> 
*/