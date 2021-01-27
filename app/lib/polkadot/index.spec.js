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

  it('Get activeEra', async () => {
    let result = await Index.activeEra();
    console.log(result);
  });

  it.only('Get getRewardsEra', async () => {
    let activeEra = await Index.activeEra();
    let i = 0;
    let eras = Array.from(Array(84), () => {
      i++;
      return activeEra.index - i;
    });
    let result = await Index.getRewardsEra('14Ns6kKbCoka3MS4Hn6b7oRw9fFejG8RH5rq5j63cWUfpPDJ', eras);
    console.log(JSON.stringify(result))
  });
});