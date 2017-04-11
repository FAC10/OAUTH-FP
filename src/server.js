const hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const server = new hapi.Server();
const fs = require('fs');
const cookie = require('hapi-auth-cookie');
const env2 = require('env2')('./config.env');
const routes = require('./routes');
const contextCredentials = require('hapi-context-credentials');

server.connection({ port: process.env.PORT || 4000,
  tls: {
        key: fs.readFileSync(path.join(__dirname, '../keys/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../keys/cert.pem'), 'utf8')
    },
    host: 'localhost'
});

// server.state('oAuthWorkshop', {
//   ttl: 1000 * 60,
//   path: '/',
//   isSecure: true,
//   encoding: 'base64json'
// })

server.register([inert, cookie], (err) => {
  if (err) throw err;
  server.route(routes);
  server.auth.strategy('session', 'cookie', 'optional', {
    password: process.env.COOKIE_PASSWORD,
    cookie: 'oauthCookie',
    isSecure: true,
    ttl: 2 * 60 * 1000,
  });
  // server.auth.default('session');
});

module.exports = server;
