module.exports = function(app) {

	var FB = require('fb');
	
	var Likes = require('../models/likes')
  	  , Feed = require('../models/feed');

    var QuestController = {
    	index : function(req, res){
			res.render('index', {
				user : req.user
			});
    	},

        indexQuestionario: function(req, res) {
            res.render('questionario');
        },

        salvarFeedsEPosts: function(req, res) {

            FB.api('oauth/access_token', {
                client_id: '1080743178644933',
                client_secret: '6e489c281c1928f822a352f7fdfc8368',
                grant_type: 'client_credentials'
            }, function(token) {
                if (!token || token.error) {
                    console.log(!res ? 'error occurred' : token.error);
                    return;
                }

                var accessToken = token.access_token;

                FB.setAccessToken(accessToken);

                FB.api('/' + req.user.facebook.id + '/likes', {
                    access_token: accessToken
                }, function(response) {
                    if (!response || response.error) {
                        console.log(!response ? 'error occurred' : response.error);
                        return;
                    }

                    response.data.forEach(function(item) {
                        item.id_usuario = req.user.facebook.id;

                        var likes = new Likes();
                        likes.name = item.name;
                        likes.id = item.id;
                        likes.created_time = item.created_time;
                        likes.id_usuario = item.id_usuario;

                        likes.save(function(err, data) {
                            if (err) {
                                res.status(500).send("Erro")
                            };

                        });

                    });

                });

                FB.api('/' + req.user.facebook.id + '/feed', {
                    access_token: accessToken
                }, function(response) {
                    if (!response || response.error) {
                        console.log(!response ? 'error occurred' : response.error);
                        return;
                    }

                    response.data.forEach(function(item) {
                        item.id_usuario = req.user.facebook.id;
                        var feed = new Feed();

                        feed.message = item.message;
                        feed.history = item.history;
                        feed.id = item.id;
                        feed.created_time = item.created_time;
                        feed.id_usuario = item.id_usuario;

                        feed.save(function(err, data) {
                            if (err) {
                                res.status(500).send("Erro")
                            };

                        });

                    });

                });

            });
            res.status(200).send("sucesso");
        }
    }
    return QuestController;
}