var UserDB = require('./models/user');

module.exports = function(app, passport) {

	app.get('/', function(req, res) { // post to work on canvas, GAE needs "app.get"
		res.render('index.ejs', {
			user : req.user
		});
	});

	app.get('/profile', function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope : [ 'email' ]
	})); 

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/error'
	}));
};
