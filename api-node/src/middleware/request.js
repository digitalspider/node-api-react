// Define extra functionality for req and res objects
module.exports = (req, res, next) => {
  req.getHost = () => {
    return req.protocol + '://' + req.get('host');
  };
  next();
};
