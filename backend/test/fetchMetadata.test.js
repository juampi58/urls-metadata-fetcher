import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js';

var csrfToken;

const agent = request.agent(app);

describe('GET /csrf-token', () => {
  it('should return a CSRF token', (done) => {
    agent
      .get('/csrf-token')
      .end((err, res) => {
        csrfToken = res.body.csrfToken;
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('csrfToken');
        done();
      });
  });
});

describe('POST /fetch-metadata', () => {

  it('should return metadata for valid URLs', (done) => {
    console.log('token in test function:'+ csrfToken);
    agent
      .post('/fetch-metadata')
      .set('CSRF-Token', csrfToken)
      .send({ urls: ['https://booking.com', 'https://amazon.com'] })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('url');
        expect(res.body[0]).to.have.property('title');
        expect(res.body[0]).to.have.property('description');
        done();
      });
  });

  it('should return an error for invalid URLs', (done) => {
    agent
      .post('/fetch-metadata')
      .set('CSRF-Token', csrfToken)
      .send({ urls: ['invalid-url'] })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('errors');
        done();
      });
  });
});


describe('Rate Limiting', () => {
  it('should allow up to 5 requests within the rate limit', (done) => {
    const agent = request.agent(app); 

    const makeRequest = () => 
      agent.get('/csrf-token').set('X-Forwarded-For', '123.123.123.123').expect(200);


    // Make 5 successful requests
    Promise.all([
      makeRequest(),
      makeRequest(),
      makeRequest(),
      makeRequest(),
      makeRequest()
    ])
      .then(() => done())
      .catch(done);
  });

  it('should block the 6th request', (done) => {
    const agent = request.agent(app);

    const makeRequest = () =>
      agent.get('/csrf-token').set('X-Forwarded-For', '123.123.123.122');

    // Make 5 successful requests
    Promise.all([
      makeRequest().expect(200),
      makeRequest().expect(200),
      makeRequest().expect(200),
      makeRequest().expect(200),
      makeRequest().expect(200)
    ])
      .then(() => {
        // 6th request should be blocked
        return makeRequest().expect(429);
      })
      .then((res) => {
        expect(res.text).to.equal("Too many requests from this IP, please try again after a minute");
        done();
      })
      .catch(done);
  });
});
