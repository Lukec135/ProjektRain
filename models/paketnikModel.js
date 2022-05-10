var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paketnikSchema = new Schema({
    'naziv': String,
    'lastnikId': String,

    'odklepi': [{
        'datum': Date,
        'oseba': String
    }]

}, {
    timestamps: true
});

//module.exports = mongoose.model('paketnik', paketnikSchema);
const Paketnik = mongoose.model('paketnik', paketnikSchema);
module.exports = Paketnik;