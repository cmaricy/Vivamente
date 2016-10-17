var express = require('express')
  , cfg = require('./config.json')
  , cookieParser = require('cookie-parser')
  , consign = require('consign')
  , session = require('express-session')
  , morgan = require('morgan')
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , flash = require('connect-flash')
  , configDB = require('./config/database.js')
  , compression = require('compression')
  , methodOverride = require('method-override')
  , cookie = cookieParser(cfg.SECRET)
  , app = express();

require('./config/passport')(passport); 

mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;

// ...stack de configurações do servidor...
consign()
  .include('controllers')
  .into(app);

// Configuracoes de views
app.disable('x-powered-by');
app.set('views', __dirname + '/views');

app.use(morgan('dev'));
app.use(cookie);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'anystringoftext', 
	saveUninitialized: true, 
	resave: true
}));

// Comprimir transacoes de requisicoes 
app.use(compression());

app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use('/public',  express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

require('./routes/routes.js')(app);
require('./routes/fbroutes.js')(app, passport);

// Permitir proxy reverso (Nginx, GAE, etc)
app.enable('trust proxy');

app.listen(process.env.PORT, function () {
	console.log("Aplicação rodando na porta " + process.env.PORT);
});

module.exports = app;