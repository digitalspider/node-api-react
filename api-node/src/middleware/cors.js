const common = require('./../common');

// CORS middleware implementation
module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, AuthToken,'+
     'UserToken, Cache-Control, Pragma, Expires'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, PATCH');
    return res.status(common.statusCode['SUCCESS']).json({});
  }
  next();
};
