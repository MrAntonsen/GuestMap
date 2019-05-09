const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', function(done) {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏' 
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('Responds with inserted message', function(done) {
    const requestObject = {
        name:  'Morgan',
        message: 'Her finn du meg',
        latitude: -90,
        longitude: 180
    };
    const responseObj ={
      ...requestObject,
      _id: '324tregfafasdfasdff4',
      date: '2018-07-25T01:23:51.029Z'
    };
    
    request(app)
      .post('/api/v1/messages')
      .send(requestObject)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '324tregfafasdfasdff4';
        res.body.date = '2018-07-25T01:23:51.029Z';
      })
      .expect(200, responseObj, done);
  });
  it('can signup with an diacritical name', (done)=>{
    const requestObject = {
      name:  'æøåæøåö',
      message: 'Her finn du meg',
      latitude: -90,
      longitude: 180
  };
  const responseObj ={
    ...requestObject,
    _id: '324tregfafasdfasdff4',
    date: '2018-07-25T01:23:51.029Z'
  };
  
  request(app)
    .post('/api/v1/messages')
    .send(requestObject)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(res => {
      res.body._id = '324tregfafasdfasdff4';
      res.body.date = '2018-07-25T01:23:51.029Z';
    })
    .expect(200, responseObj, done);
  });
});
