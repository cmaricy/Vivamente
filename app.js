var express = require('express')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , morgan = require('morgan')
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , flash = require('connect-flash')
  , configDB = require('./config/database.js')
  , app = express();

require('./config/passport')(passport); 

mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext', saveUninitialized: true, resave: true}));
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 
app.set('view engine', 'ejs');
app.enable('trust proxy');

require('./app/routes.js')(app, passport);

app.listen(process.env.PORT || '3001', function () {
	console.log("Aplicação rodando na porta 3001");
});