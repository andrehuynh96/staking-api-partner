/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const redis = require("app/lib/redis");
init();
const Index = require("./index");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should();

describe('Test MXC Price', function () {
  beforeEach((done) => {
    setTimeout(done, 1000)
  });
  it('Get Price', async () => {
    let result = await Index.getPrice("CPAY");
    console.log(result);
    expect(result).to.be.an('object')
  });
});

function init() {
  redis.init(async err => {
    console.log(err);
  });
}