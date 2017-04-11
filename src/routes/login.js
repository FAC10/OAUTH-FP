require('env2')('./config.env');

module.exports = {
  method: 'GET',
  path: '/login',
  config: {auth: false},
  handler: (req, reply) => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    reply.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&client_secret=${clientSecret}`);
  },
};
