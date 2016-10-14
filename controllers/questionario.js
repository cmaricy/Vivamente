module.exports = function(app) {

    var FB = require('fb');
    var cfg = require('../config.json');
    var moment = require('moment');
    var Likes = require('../models/likes'),
        Feed = require('../models/feed'),
        Quest = require('../models/questionario');

    var QuestController = {
        index: function(req, res) {
            res.render('index', {
                user: req.user
            });
        },

        indexQuestionario: function(req, res) {
            res.render('questionario');
        },

        perfil: function(req, res) {
            res.render('profile.ejs', {
                user: req.user
            });
        },

        salvar: function(req, res) {

            Quest.find({
                'id_usuario': req.user.facebook.id
            }, function(err, usuario) {
                if (err) res.status(500).send("Erro ao consultar o usuário");
                if (usuario.length > 1) {
                    res.status(200).send("Usuário só pode responder duas vezes o qustionário");
                } else {

                    if (usuario.length !== 0){
                        var diferenca = moment().diff(usuario[0].created_time, new Date());
                        var duracao = new moment.duration(diferenca);
                        var dias = Math.ceil(duracao.asDays());    
                    }
                    
                    if (dias > 60 || usuario.length == 0) {
                        // salvando o questionario
                        var quest = new Quest();
                        quest.id_usuario = req.user.facebook.id;
                        quest.nome = req.user.facebook.name;
                        quest.sexo = req.body.sexo;
                        quest.idade = req.body.idade;
                        quest.autoriza = req.body.autoriza;
                        quest.created_time = new Date();

                        quest.respostas = req.body.respostas;

                        quest.save(function(err, data) {
                            if (err) res.send("Erro ao salvar o questionário");
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

                                Likes.findOne({'id_usuario' : req.user.facebook.id}, function(err, retLikes){
                                    if (err) res.status(500).send("Erro ao buscar likes");
                                        if ( retLikes ){
                                            response.data.forEach(function(item){
                                                var aux = false;
                                                retLikes.likes.forEach(function( itLike ){                                                    
                                                    if ( itLike.id == item.id ) aux = true;
                                                });
                                                
                                                if ( aux == false ){
                                                    retLikes.likes.push(item);
                                                }
                                            });
                                            retLikes.save();
                                        } else {
                                            
                                            var likes = new Likes();
                                            likes.id_usuario = req.user.facebook.id;
                                            likes.nome_usuario = req.user.facebook.name;

                                            response.data.forEach(function(item) {
                                                var like = item;
                                                likes.likes.push(item);
                                            });

                                            likes.save(function(err, data) {
                                                if (err) {
                                                    res.status(500).send("Erro")
                                                };

                                            });

                                        }
                                })

                            });

                            FB.api('/' + req.user.facebook.id + '/posts?limit=5000', {
                                access_token: accessToken
                            }, function(response) {
                                if (!response || response.error) {
                                    console.log(!response ? 'error occurred' : response.error);
                                    return;
                                }
                                
                                Feed.findOne({'id_usuario' : req.user.facebook.id}, function(err, retFeed){
                                    if (err) res.status(500).send("Erro ao buscar os posts");
                                    if ( retFeed ){
                                        response.data.forEach(function(item){
                                            var aux = false;
                                            retFeed.posts.forEach(function( itFeed ){                                                    
                                                if ( itFeed.id == item.id ) aux = true;
                                            });
                                                
                                            if ( aux == false ){
                                                retFeed.posts.push(item);
                                            }
                                        });
                                        retFeed.save();
                                    } else {

                                        var feed = new Feed();
                                        feed.id_usuario = req.user.facebook.id;
                                        feed.nome_usuario = req.user.facebook.name;

                                        response.data.forEach(function(item) {
                                            var post = item;
                                            feed.posts.push(item);
                                        });

                                        feed.save(function(err, data) {
                                            if (err) {
                                                res.status(500).send("Erro")
                                            };

                                        });            

                                    }
                                })                               

                            });

                        });
                        res.status(200).send("Salvo com sucesso");
                    } else {
                        res.status(200).send("Você deverá responder o questionário após dois meses");
                    }

                }
            });
        }

    }
    return QuestController;
}