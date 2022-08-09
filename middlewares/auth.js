const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(err);
  }

  req.user = payload;

  return next();
};
