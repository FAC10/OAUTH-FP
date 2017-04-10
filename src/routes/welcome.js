const request = require('request');
const env2 = require('env2')('./config.env');

module.exports = {
  method: 'GET',
  path: '/welcome',
  handler: (req, reply) => {
    const query = req.url.query;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    request.post(`https://github.com/login/oauth/access_token?code=${query.code}&client_id=${clientId}&client_secret=${clientSecret}`, function (err, res, body){
      if (err) console.log(err);
      console.log(body);
      reply.redirect('/');
    });
  },
};
