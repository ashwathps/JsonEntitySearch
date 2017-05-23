# Json Entity Search Tool
A JSON search cli tool using Ash's query language (AQL)

# Getting started
### Setup instructions & system requirements
Install Git and NodeJs v6 or above

Setup:
```
  git clone 'this repo'
  npm install
```
# Usage 
```
  > node src/index.js
```
### Search
The application is a commandline tool which starts up with a sample list of valid queries.
The query format is also displayed on the screen like this.
```
   > search <resource> where <\"double quoted Where clause\">

```

### Unit tests
The tests are written using a BDD. NodeJS has an extensive library collection to support BDD. This repo uses chai, assert, should and SinonJs for method stubs.
```
  > npm test
```
### Coverage

```
  > ./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha ./test/**/*.test.js -- -R spec
```

# Design decisions
### SRP
The application has 4 components that are built on SRP principles, the query parser, executor, entity builder and the formatter.
1. The parser is simple and supports either OR or AND operations on the query string, the query string comes from the command-line in accordance with the documented format.
2. The query runner gets the fields to search on from the parser and filters the entities using Underscore/lodash npm package
3. The resource/entity builder reads and understands a relationship graph to extend the present payload. The graph is a simple JSON file with entity fields mapping.
4. The query formatter is a simple console string formatter, it is reads the payload and creates a user friendly result string.

### OCP
The search functionality is extensible in terms of adding new resources/entities and searching them without making code changes. All one needs to do is, put a new json entity under the ‘models’ folder and update the relationship graph. However, the query formatter is currently written for just these 3 entities (tickets, users, orgs)

### Performance
The applications runtime performance is a downward curve (# of queries executed Vs time taken), this is due to built-in caching. Since runtime updates to JSON model data is not in the scope of this application, as more queries are run the faster it gets. Caching is implemented using LRU and purges every X mins. (configurable via the ENV variable ‘QUERY_CACHE_DURATION’).

In the real world, efficiently sharded DBs can be stored entirely in memory to reduce round trip latencies. Caching improves query times and reduces the round trip calls to DBs but suffers consistency. An efficient purge will improve read throughput. Writes must invalidate caches.

Data load performance is limited by the system memory and LRU cache purges entities that are not used for a long time.


