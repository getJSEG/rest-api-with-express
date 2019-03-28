process.env.NODE_ENV = 'test';

//dev dependecies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index.js');
let should = chai.should();
const expect = chai.expect;
var assert = require('assert');

chai.use(chaiHttp);

describe('GET /users', function() {
  this.timeout(3000);

  it('/api/users should should return verified users', function(done) {
    chai.request(server)
    .get('/api/users')
    .send( { emailAddress : "Sam Smith", password:"password"})
    .end( (err, res) => {
      expect(res.body).to.have.own.property("_id");
      expect(res.body).to.have.own.property("fullName");
      expect(res.body).to.have.own.property("emailAddress");
      expect(res.body).to.have.own.property("password");
      expect(err).to.be.null;
      done();
    })
  });

});

describe('/courses', function() {
  it('it should return json with all the courses', function(done) {
    chai.request(server)
    .get('/api/course/57029ed4795118be119cc43d')
    .end( (err, res) => {
      expect(res).to.be.json;
      expect(err).to.be.null;
      done();
    })
  });
});
