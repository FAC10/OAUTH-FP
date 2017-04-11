const hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const server = new hapi.Server();
const fs = require('fs');
const cookie = require('hapi-auth-cookie');
const env2 = require('env2')('./config.env');
const routes = require('./routes');
const contextCredentials = require('hapi-context-credentials');
const jwtAuth = require('hapi-auth-jwt2');

server.connection({ port: process.env.PORT || 4000,
  tls: {
        key: fs.readFileSync(path.join(__dirname, '../keys/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../keys/cert.pem'), 'utf8')
    },
    host: 'localhost'
});

const people = {
  20152018: {
    name: "pbywater",
    url: 'https://avatars0.githubusercontent.com/u/20152018?v=3'
  }
}

const validate = (token, request, callback) => {
  console.log(token.user.user_id, token.user.username);
if (people[token.user.user_id]) {
  return callback(null, true);
}
return callback(null, false);
}

// server.state('oAuthWorkshop', {
//   ttl: 1000 * 60,
//   path: '/',
//   isSecure: true,
//   encoding: 'base64json'
// })

server.register([inert, cookie, jwtAuth], (err) => {
  if (err) throw err;
  server.route(routes);
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JSON_SECRET,
    validateFunc: validate,
    verifyOptions: {algorithms: [ 'HS256' ]}
  });
  server.auth.default('jwt');
});

module.exports = server;
