var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var imageSchema = new Schema({
	'ime' : String,
	'slika' : String
});

module.exports = mongoose.model('image', imageSchema);
