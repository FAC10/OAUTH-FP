module.exports = {
  method: 'GET',
  path: '/secure',
  handler: (req, reply) => {
    reply('yo you are secure or something');
  },
};
