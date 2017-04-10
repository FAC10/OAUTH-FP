const test = require('tape');
const server = require('./../src/server');

test('test the home route', (t) => {
  var options = {
    url: '/',
    method: 'GET',
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 200, '');
    t.end();
  });
});

test('test the login route', (t) => {
  var options = {
    url: '/login',
    method: 'GET',
  };
  server.inject(options, (res) => {
    t.equal(res.statusCode, 302, '');
    t.end();
  });
});
