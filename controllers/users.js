const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/not-found-err');
const AuthError = require('../errors/not-found-err');
const DefaultError = require('../errors/default-err');

const { JWT_SECRET = 'some-secret-key' } = process.env;

/* eslint no-unused-vars: ["error", {"args": "none"}] */

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      next(new DefaultError(err));
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      } if (err.code === 11000) {
        next(new AuthError('Пользователь с таким email уже существует'));
      } else {
        next(new DefaultError(err));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      } if (err.code === 11000) {
        next(new AuthError('Пользователь с таким email уже существует'));
      } else {
        next(new DefaultError(err));
      }
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      } else {
        next(new DefaultError(err));
      }
    });
};
