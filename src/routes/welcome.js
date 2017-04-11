const request = require('request');
const env2 = require('env2')('./config.env');
const queryString = require('querystring');
const jwt = require('jsonwebtoken');

module.exports = {
    method: 'GET',
    path: '/welcome',
    config: {auth: false},
    handler: (req, reply) => {
        const query = req.url.query;
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        request.post(`https://github.com/login/oauth/access_token?code=${query.code}&client_id=${clientId}&client_secret=${clientSecret}`, function(err, res, accessToken) {
            if (err) console.log(err);
            else {
                const query = queryString.parse(accessToken).access_token;
                request.get({
                    url: 'https://api.github.com/user',
                    headers: {
                        'User-Agent': 'oauth_github_jwt',
                        Authorization: `token ${query}`
                    }
                }, (err, res, body) => {
                    if (err) console.log(err);
                    body = JSON.parse(body);
                    let options = {
                        'expiresIn': Date.now() + 24 * 60 * 60 * 1000,
                        'subject': 'github-data'
                    }
                    let payload = {
                        'user': {
                            'username': body.login,
                            'img_url': body.avatar_url,
                            'user_id': body.id
                        },
                        'accessToken': query
                    };
                    jwt.sign(payload, process.env.JSON_SECRET, options, (err, token) => {
                        if (err) console.log(err);
                        let config = {
                            path: '/', // the token is valid for every path starting with /
                        }
                        reply('You are logged in. This would ideally be a handlebars view instead').state('token', token, config);
                    });
                })
            }
        });
    },
};
