const hapi = require('hapi');
const inert = require('inert');
const path = require('path');
const server = new hapi.Server();
const fs = require('fs');

const routes = require('./routes');

server.connection({ port: process.env.PORT || 4000,
  tls: {
        key: fs.readFileSync(path.join(__dirname, '../keys/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../keys/cert.pem'), 'utf8')
    },
    host: 'localhost'
});

server.state('oAuthWorkshop', {
  ttl: 1000 * 60,
  path: '/',
  isSecure: true,
  encoding: 'base64json'
})

server.register(inert, (err) => {
  if (err) throw err;

  server.route(routes);

});

module.exports = server;
