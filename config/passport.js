/*
* Este script é responsável por implementar funções de autenticação
* da biblioteca passport.js.
*/
module.exports = function(passport) {
	// Obtendo a estratégia de passport-facebook-canvas
	var FacebookStrategy = require('passport-facebook-canvas').Strategy;

	// Carregando o as configuração de autorização do facebook
	var configAuth = require('./auth');

	// Carregando o modelo do mongoose referente a entidade usuario
	var UserDB = require('../models/user');

	// Função responsável por serializar usuário (converter objeto em bytes)
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Processo inverso da serialização
	passport.deserializeUser(function(id, done) {
		UserDB.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Aplicando os argumentos necessários para a instância do passport.js
	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		profileFields : [ 'id', 'name', 'email' ]
	}, function(accessToken, refreshToken, profile, done) {
		
		process.nextTick(function() {
			// Uso da função findOne do mongoDB que pesquisa por um único registro
			// esperando como padrão pelo menos um parâmetro de entrada.
			UserDB.findOne({
				'facebook.id' : profile.id
			}, // if use findOrCreate "502 bad gatway nginx" eror
			function(err, user) {
				// Em caso de erro envia para quem chamou
				if (err) {
					return done(err);
				}
				// Em caso do usuário já cadastrado retorna o usuário encontrado
				if (user) {
					return done(null, user);
				} else {
					// Em caso de usuário não cadastrado cadastra na base de dados usando os dados de retorno
					// do facebook e armazena no MongoDB, por fim retorna o usuário.
					var newUser = new UserDB();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.email = profile.emails[0].value;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.save(function(err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});

				}
			});
		});
	}));
}; // close module.exports
