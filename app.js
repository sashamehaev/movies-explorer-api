require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

const {
  PORT = 3000,
  dataMovies = 'mongodb://localhost:27017/moviesdb',
} = process.env;

mongoose.connect(dataMovies);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(require('./routes/authentification'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use((req, res, next) => {
  next(new NotFoundError('Страница по такому адресу не найдена'));
});

app.use(errorLogger);

app.use(errors());

/* eslint no-unused-vars: ["error", {"args": "none"}] */

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {

});
