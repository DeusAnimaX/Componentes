'use strict';

// server.js (Express 4.0)

// BASE SETUP
// ==============================================

// call the packages we need
let express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		dbURI = 'mongodb://localhost/testMovie',
		port = process.env.PORT || 8080;

// connect to mongodb
mongoose.connect(dbURI);

//  require models
let Movie = require('./api/models/movie');


// DEFINE THE MIDDLEWARE FOR APP
// ==============================================

// configure app to use bodyParser()
// this will let us get data from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
// ==============================================

// get an instance of the express router
let apiRouter = express.Router();

// test router
// apiRouter.get('/', (req, res) => {
// 	res.json({ message: 'welcome to out api' });
// });

// MIDDLEWARE to use for all requests
apiRouter.use((req, res, next) => {
	// do something before running routes
	console.log('Happening before routes...');
	next();   // don't stop here, go to next route
});

// routes 
// generic root route of the api
apiRouter.get('/', (req, res) => {
	res.json({ message: 'Hello API!' });
});

// on routes that end in /beers
apiRouter.route('/movies')
	// create a movie (http://localhost:8080/api/movies)
	.post((req, res) => {
		let movie = new Movie();

		movie.name = req.body.name;
		movie.type = req.body.type;
		movie.country = req.body.country;
		movie.genre = req.body.genre;
		movie.director = req.body.director;

		movie.save(err => {
			if (err) res.send(err);
			res.json({ message: 'Movie created!' });
		});
	})
	// get all movies (http://localhost:8080/api/movies)
	.get((req, res) => {
		Movie.find((err, movies) => {
			if (err) res.send(err);
			res.json(movies);
		});
	});

// on routes that end in /movies/:movie_id
apiRouter.route('/movie/:movie_id')
	// get a movie by id (http://localhost:8080/api/movies/:movie_id)
	.get((req, res) => {
		Movie.findById(req.params.movie_id, (err, movie) => {
			if (err) res.send(err);
			res.json(movie);
		});
	})
	// update a movie by id (http://localhost:8080/api/movie/:movie_id)
	.put((req, res) => {
		Movie.findById(req.params.movie_id, (err, movie) => {
			if (err) res.send(err);
			// update info
			movie.name = req.body.name;
			movie.type = req.body.type;
			movie.country = req.body.country;
			movie.genre = req.body.genre;
			movie.director = req.body.director;
			// save movie
			movie.save(err => {
				if (err) res.send(err);
				res.json({ message: 'Movie updated!' });
			});
		});
	})
	// delete a movie by id (http://localhost:8080/api/movie/:movie_id)
	.delete((req, res) => {
		Movie.remove({ _id: req.params.movie_id }, (err, movie) => {
			if (err) res.send(err);
			res.json({ message: 'Successfully deleted!'});
		});
	});


// register our routes
// all routes will be prefixed with /api
app.use('/api', apiRouter);



// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
