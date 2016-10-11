module.exports = function(app, passport) {
 
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope : [ 'email', 'user_likes', 'user_posts' ]
	})); 

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/questionario',
		failureRedirect : '/error'
	}));

};
