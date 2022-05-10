var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//------------------------------------//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var paketnikiRouter = require('./routes/paketnikRoutes');
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//------------------------------------//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/paketnik', paketnikiRouter);
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


module.exports = app;
