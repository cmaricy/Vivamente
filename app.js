var express = require('express')
  , cfg = require('./config.json') // carrega o json de configurações 
  , cookieParser = require('cookie-parser') // faz parse do cookie header
  , consign = require('consign') // antigo load, injeta scripts na sessao do express
  , session = require('express-session') // sessao do express
  , morgan = require('morgan') // HTTP request logger
  , mongoose = require('mongoose') // biblioteca para manipular MongoDB
  , bodyParser = require('body-parser') // faz parte do corpo das requisições
  , passport = require('passport') // biblitoca usada para fazer login com facebook
  , flash = require('connect-flash') // usado para armezenar mensagens
  , configDB = require('./config/database.js') // carrega as configuracoes do mongoDB
  , compression = require('compression') // comprimi transicoes http
  , methodOverride = require('method-override') // permiti usar PUT e DELETE 
  , cookie = cookieParser(cfg.SECRET) // gera um cookie para a aplicacao baseada em um segredo
  , app = express() // cria a aplicacao
  , MongoStore = require('connect-mongo')(session)
  , server = require('http').Server(app);

// carrega o passport.js
require('./config/passport')(passport); 

// conexao com MongoDB
mongoose.connect(configDB.url);


mongoose.Promise = global.Promise;
  
// injeta os controllers em app
consign()
  .include('controllers')
  .into(app);

// Configuracoes de views
app.disable('x-powered-by');

// aponta o caminho onde ficarão as views do express
app.set('views', __dirname + '/views');

// loga em ambiente de desenvolvimento
app.use(morgan('dev'));

// Seta o cookie na aplicação
app.use(cookie);

// Seta o body-paser na aplicação
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: cf.SECRET, 
    name: "vivamente_cookie",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
}));

// Comprimir transacoes de requisicoes 
app.use(compression());

// Configurações e iniciação do passport
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 

// Seta a view engine do express
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

// Caminhos estaticos que serão usados nas views
app.use('/public',  express.static(__dirname + '/public'));

// bower é um gerenciador de pacotes. Todos os pacotes baixados por ele
// ficarão do diretório bower na raiz da aplicação
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// injetando as rotas criadas
require('./routes/routes.js')(app);
require('./routes/fbroutes.js')(app, passport);

// Permitir proxy reverso (Nginx, GAE, etc)
app.enable('trust proxy');

// inicia o servidor
server.listen(process.env.PORT, function(){
  console.log("Vivamente no ar.");
});

// exporta app no contexto da aplicação
module.exports = app;