# EntitySearcher
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
