const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/moviesdb');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log('listening');
});
