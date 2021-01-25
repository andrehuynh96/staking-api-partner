/*eslint no-process-env: "off"*/
require('dotenv').config();
require('rootpath')();
const Index = require("./index");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.should()

describe('Test DOT', function () {
  it('checkAddress', async () => {
    let result = await Index.checkAddress('5HQGHHrz1DMhCP8UkoqJieTRw7KHTjRjLyCujDvu8fPJm5gu');
    expect(result).to.be.an('boolean');
  });

  it.only('Get activeEra', async () => {
    let result = await Index.activeEra();
    console.log(result)
  });

  it('Get getRewardsEra', async () => {
    let result = await Index.getRewardsEra('5HQGHHrz1DMhCP8UkoqJieTRw7KHTjRjLyCujDvu8fPJm5gu', [3164, 3165, 3223, 3224, 3225, 3226, 3227]);
    console.log(JSON.stringify(result))
  });
});