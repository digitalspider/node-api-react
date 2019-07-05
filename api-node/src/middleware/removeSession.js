let {requestService} = require('../service/RequestService');

// Handler to remove requestId, once a request lifecyle has finished
module.exports = (req, res, next) => {
    res.on('finish', function() {
      requestService.unset(req.requestId);
    });
    next();
};
