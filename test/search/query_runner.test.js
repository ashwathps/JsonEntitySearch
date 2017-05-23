'use strict';

const chai = require('chai')
    , spies = require('chai-spies');

const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = chai.expect;

chai.use(spies);
chai.use(chaiAsPromised);
