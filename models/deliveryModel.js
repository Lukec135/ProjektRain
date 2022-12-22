var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deliverySchema = new Schema({
	'username' : String,
	'hour' : String,
	'day' : String,
	'weather' : String,
	'holiday' : String,
	'signed' : String,
	'rating' : String
});

var Delivery = mongoose.model('delivery', deliverySchema);
module.exports = Delivery;
