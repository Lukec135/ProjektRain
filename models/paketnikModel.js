var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paketnikSchema = new Schema({
    'naziv': String,
    'lastnikId': String,

    //seznam oseb, ki lahko dostopajo do paketa
    'osebeZDostopom': [String],

    'odklepi': [{
        'datum': Date,
        'oseba': String
    }],

    //bool ali je prazen ali poln
    'poln': Boolean

    //tokens za prijavo

}, {
    timestamps: true
});

//module.exports = mongoose.model('paketnik', paketnikSchema);
const Paketnik = mongoose.model('paketnik', paketnikSchema);
module.exports = Paketnik;