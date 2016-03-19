// movie model

'use strict';

let mongoose = require('mongoose'),
		Schema = mongoose.Schema;

let MovieSchema = new Schema({
	name: String,
	type: String,
	country: String,
	genre: String,
	director: String
});

module.exports = mongoose.model('Movie', MovieSchema);


