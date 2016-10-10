var UserDB = require('./models/user');
var Likes = require('./models/likes');
var Feed = require('./models/feed');

module.exports = function(app, passport) {

	app.get('/', function(req, res) { // post to work on canvas, GAE needs "app.get"
		res.render('index.ejs', {
			user : req.user
		});
	});

	app.get('/profile', function(req, res) {
		console.log(req.user);
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope : [ 'email', 'user_likes', 'user_posts' ]
	})); 

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/questionario',
		failureRedirect : '/error'
	}));

	app.get('/questionario/salvar', function(req, res){

		var FB = require('fb');

		FB.api('oauth/access_token', {
		    client_id: '1080743178644933',
		    client_secret: 'xxxxxxxxxxx',
		    grant_type: 'client_credentials'
		}, function (token) {
		    if(!token || token.error) {
		        console.log(!res ? 'error occurred' : token.error);
		        return;
		    }

		    var accessToken = token.access_token;

		    FB.setAccessToken(accessToken);
		    
		    FB.api('/'+ req.user.facebook.id +'/likes', { access_token: accessToken }, function (response) {
			  if(!response || response.error) {
			    console.log(!response ? 'error occurred' : response.error);
			    return;
			  }

			  response.data.forEach(function(item){
			  	item.id_usuario = req.user.facebook.id;

			  	var likes = new Likes();
				likes.like.name = item.name;
				likes.like.id = item.id;
				likes.like.created_time = item.created_time;
				likes.like.id_usuario = item.id_usuario;
		
				  likes.save(function(err, data){
				  	if (err) { res.status(500).send("Erro")};
				  	
				  });

			  });
 
			});

		    FB.api('/'+ req.user.facebook.id +'/feed', { access_token: accessToken }, function (response) {
			  if(!response || response.error) {
			    console.log(!response ? 'error occurred' : response.error);
			    return;
			  }

			  response.data.forEach(function(item){
			  	item.id_usuario = req.user.facebook.id;
			  	var feed = new Feed();

			  	feed.feed.message = item.message;
				feed.feed.history = item.history;
				feed.feed.id = item.id;
				feed.feed.created_time = item.created_time;
				feed.feed.id_usuario = item.id_usuario;

				  feed.feed = item;
				  feed.save(function(err, data){
				  	if (err) { res.status(500).send("Erro")};
				  	
				  });

			  });
 
			});			
			
		});
		res.status(200).send("sucesso");
	});

	app.get('/questionario',function(req, res){
		res.render('questionario');		
	});
};
