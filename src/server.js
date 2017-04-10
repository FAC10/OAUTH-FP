const hapi = require('hapi');
const inert = require('inert');
const server = new hapi.Server();

const routes = require('./routes');

server.connection({ port: 4000, host: 'localhost' });

server.register(inert, (err) => {
  if (err) throw err;

  server.route(routes);

});

module.exports = server;
