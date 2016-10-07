var FacebookStrategy = require('passport-facebook').Strategy;
var UserDB = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		UserDB.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL,
		profileFields : [ 'id', 'name', 'email' ]
	}, function(accessToken, refreshToken, profile, done) {
		
		process.nextTick(function() {
			UserDB.findOne({
				'facebook.id' : profile.id
			}, // if use findOrCreate "502 bad gatway nginx" eror
			function(err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				} else {
					var newUser = new UserDB();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.email = profile.emails[0].value;
					newUser.facebook.name = profile.name.givenName + ' '+ profile.name.familyName;
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
