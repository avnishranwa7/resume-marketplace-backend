const jwt = require("jsonwebtoken");

function getMiddleware(req, res, next, cb) {
  const token = req.query.token;
  try {
    jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
    cb(req, res, next);
  } catch (err) {
    if (err.message === "jwt expired") {
      err.message = "Token Expired";
      err.statusCode = 422;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

function postMiddleware(req, res, next, cb) {
  const token = req.body.token;
  try {
    jwt.verify(token, process.env.ACTIVE_TOKEN_SECRET);
    cb(req, res, next);
  } catch (err) {
    if (err.message === "jwt expired") {
      err.message = "Token Expired";
      err.statusCode = 422;
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

module.exports = { getMiddleware, postMiddleware };
