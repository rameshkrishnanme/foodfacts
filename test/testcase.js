let chai = require('chai');
let expect = chai.expect;

let readline = require('../scripts/modules/readlinefile');
describe('TestCase for JSON construction', function(){
  let response = null;
  before(function(done){
	  this.timeout(500000);
	  readline().then(function(res) {
	     response = res;
	     done();
	  });
  })
  
  it ('Test for Farcarbs json', function(done){
		  var a = response[0];
	      expect(a).to.be.an('object');;
	      expect(a).to.have.all.keys('fat', 'carbohydrates', 'proteins');
	      done();
   });
  
  it ('Test for SugarSalts json', function(done){
	  var a = response[1];
      expect(a).to.be.an('object');;
      expect(a).to.have.all.keys('data');
      done();
  });
});