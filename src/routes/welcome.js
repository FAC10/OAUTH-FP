const request = require('request');
const env2 = require('env2')('./config.env');
const bcrypt = require('bcrypt');

module.exports = {
  method: 'GET',
  path: '/welcome',
  handler: (req, reply) => {
    const query = req.url.query;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    request.post(`https://github.com/login/oauth/access_token?code=${query.code}&client_id=${clientId}&client_secret=${clientSecret}`, function (err, res, accessToken){
      if (err) console.log(err);
      bcrypt.hash(accessToken, 10, function(err, hash) {
        const session = {accessToken: hash, last: Date.now()};
        reply.redirect('/').state('oAuthWorkshop', session);
      });
    });
  },
};
