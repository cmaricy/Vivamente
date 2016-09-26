var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./config/database.js');

var app = express();

var server = app.listen(process.env.PORT || '3000', function () {
	});

mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
require('./config/passport')(passport); 

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext', saveUninitialized: true, resave: true}));
app.use(passport.initialize()); //middleware com express
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.set('view engine', 'ejs');
app.enable('trust proxy');

require('./app/routes.js')(app, passport);





