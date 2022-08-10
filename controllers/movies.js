const Movie = require('../models/movie');

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then(() => {
      Movie.findByIdAndRemove(req.params.cardId)
        .then((movie) => {
          res.status(200).send(movie);
        });
    })
    .catch((err) => {
      next(err);
    });
};
