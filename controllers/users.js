const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'some-secret-key' } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {

    });
};

module.exports.createUser = (req, res, next) => User.create({
  email: req.body.email,
  password: req.body.password,
  name: req.body.name,
})
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    res.send(err);
  });

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {

    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch((err) => {

    });
};
