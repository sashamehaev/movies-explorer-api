const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/moviesdb');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.use('/users', require('./routes/users'));
app.use((err, req, res, next) => {
  res.status(400).send({ message: err.message });
});

app.listen(PORT, () => {

});
