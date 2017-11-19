// Native
const url = require('url');

// Packages
const { send } = require('micro');

// Mine
const worker = require('./worker');

worker.doWork().catch(err => {
  console.error(err);
  process.exit(1);
});

module.exports = async (req, res) => {
  const uri = url.parse(req.url);

  if (req.method !== 'GET') {
    return send(res, 405, { error: 'Method not allowed' });
  }
  if (uri.path !== '/') {
    return send(res, 404, { error: 'Not found' });
  }

  return send(res, 200, worker.currentApplicationState());
};
