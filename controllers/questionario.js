module.exports = function(app) {

	var FB = require('fb');
	var cfg = require('../config.json');
	var Likes = require('../models/likes')
  	  , Feed = require('../models/feed')
      , Quest = require('../models/questionario');

    var QuestController = {
    	index : function(req, res){
			res.render('index', {
				user : req.user
			});
    	},

        indexQuestionario: function(req, res) {
            res.render('questionario');
        },

        perfil : function(req, res){
            res.render('profile.ejs', {
                user : req.user
            });
        },

        salvar: function(req, res) {

            // salvando o questionario
            var quest = new Quest();
            quest.id_usuario = req.user.facebook.id;
            quest.nome = req.user.facebook.name;
            quest.sexo = req.body.sexo;
            quest.idade = req.body.idade;
            quest.autoriza = req.body.autoriza;
            quest.created_time = new Date();
            
            quest.respostas = req.body.respostas;

            quest.save(function(err, data){
                if (err)res.send("Erro ao salvar o questionário");
            });

            FB.api('oauth/access_token', {
                client_id: cfg.CLIENT_ID,
                client_secret: cfg.CLIENT_SECRET,
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