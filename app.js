var express = require('express')
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
app.use(cookieParser());
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
app.use(express.static(__dirname + '/public'));

require('./routes/routes.js')(app, passport);
require('./routes/fbroutes.js')(app, passport);

// Permitir proxy reverso (Nginx, GAE, etc)
app.enable('trust proxy');

app.listen(process.env.PORT || '3001', function () {
	console.log("Aplicação rodando na porta 3001");
});