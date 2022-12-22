var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


//------------------------------------//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var paketnikiRouter = require('./routes/paketnikRoutes');
var imagesRouter = require('./routes/imageRoutes');
//------------------------------------//


var mongoose = require('mongoose');
//var mongoDB = 'mongodb://127.0.0.1/ProjektRain';
//var mongoDB = "mongodb+srv://user:KhTB0fF7ARdkcYIv@projektrain.roqxq.mongodb.net/ProjectRain?retryWrites=true&w=majority";
var mongoDB = "mongodb+srv://user:KhTB0fF7ARdkcYIv@projektrain.roqxq.mongodb.net/ProjectRain?retryWrites=true&w=majority"

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));



var app = express();


exphbs = require("express-handlebars");

var hbs = require('handlebars');

//REGISTER HELPERS
hbs.registerHelper('dateformat', require('helper-dateformat'));

hbs.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('breaklines', function(text) {
    text = hbs.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new hbs.SafeString(text);
});

hbs.registerHelper('tab', function(text) {
    text = hbs.Utils.escapeExpression(text);
    text = text.replace(/\,/g,'\t\t');
    return new hbs.SafeString(text);
});

hbs.registerHelper('select', function(selected, options) {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});

///////////////////

app.engine('hbs', exphbs.engine({
    defaultLayout: "layout.hbs",
    extname: ".hbs",
    helpers: {

    },
    //partialsDir: "views/partials/", // same as default, I just like to be explicit
    layoutsDir: "views/layouts/" // same as default, I just like to be explicit
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');





var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: mongoDB})
}));

//app.use(bodyParser({limit: '8mb'}));

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));



//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
//app.use(express.json({limit: '50mb'}));

app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/images', express.static('images'));
app.use(express.static(__dirname+'/public'));
app.use(express.static('images'));


//------------------------------------//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/paketnik', paketnikiRouter);
app.use('/images', imagesRouter);
//------------------------------------//


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


/*
app.post('/paketnik/odstraniOseboZDostopom', function(req, res) {

    console.log(JSON.stringify(req.body));
    res.send(req.body.self);
});
*/




module.exports = app;
