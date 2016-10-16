module.exports = function(app) {

    var FB = require('fb');
    var cfg = require('../config.json');
    var moment = require('moment');
    var Quest = require('../models/questionario');

    var QuestController = {
        index: function(req, res) {
            res.redirect('/auth/facebook');
        },

        indexQuestionario: function(req, res) {
            res.render('questionario');
        },

        salvar: function(req, res) {

            Quest.findOne({
                'id_usuario': req.user.facebook.id
            }, function(err, quest) {

                if (err) res.status(500).send("Erro ao consultar o usuário");

                if ( quest ) {
                    
                    if (quest.respostas.length > 1) {
                        res.status(200).send("Usuário só pode responder duas vezes o questionário");
                    } 
                    
                    var diferenca = moment().diff(quest.created_time, new Date());
                    var duracao = new moment.duration(diferenca);
                    var dias = Math.ceil(duracao.asDays());
                    
                } else {
                    quest = new Quest();
                }

                if ( dias > 60 || quest.respostas.length == 0) {

                    quest.id_usuario = req.user.facebook.id;
                    quest.nome = req.user.facebook.name;
                    quest.sexo = req.body.sexo;
                    quest.idade = req.body.idade;
                    quest.autoriza = req.body.autoriza;
                    
                    // Para criar somente na primeira vez da resposta
                    if ( quest.respostas.length == 0 )
                        quest.created_time = new Date();

                    quest.respostas.push(req.body.respostas);

                    // salvando nivel
                    var idx = quest.respostas.length - 1;
                    quest.respostas[idx].nivel = 0;
                    var nivel = 0;

                    var obj = req.body.respostas;
                    for (var property in obj) {
                        nivel += parseFloat(obj[property]);
                    }

                    quest.respostas[idx].nivel = nivel;
                    quest.respostas[idx].created_time = new Date();

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

                        FB.api('/' + req.user.facebook.id + '/likes?limit=5000', {
                            access_token: accessToken
                        }, function(response) {

                            if (!response || response.error) {
                                console.log(!response ? 'error occurred' : response.error);
                                return;
                            }

                            if (quest.likes.length > 0) {

                                response.data.forEach(function(item) {
                                    var aux = false;
                                    quest.likes.forEach(function(itLike) {
                                        if (itLike.id == item.id) aux = true;
                                    });

                                    if (aux == false) {
                                        quest.likes.push(item);
                                    }
                                });

                            } else {

                                response.data.forEach(function(item) {
                                    quest.likes.push(item);
                                });

                            }

                        });

                        FB.api('/' + req.user.facebook.id + '/posts?limit=5000', {
                            access_token: accessToken
                        }, function(response) {
                            if (!response || response.error) {
                                console.log(!response ? 'error occurred' : response.error);
                                return;
                            }

                            if (quest.posts.length > 0) {

                                response.data.forEach(function(item) {
                                    var aux = false;
                                    quest.posts.forEach(function(itFeed) {
                                        if (itFeed.id == item.id) aux = true;
                                    });

                                    if (aux == false) {
                                        quest.posts.push(item);
                                    }
                                });

                            } else {

                                response.data.forEach(function(item) {
                                    quest.posts.push(item);
                                });

                            }

                            quest.save(function(err, data) {
                                if (err) res.status(500).send("Erro ao salvar o questionário");
                                res.status(200).send("Salvo com sucesso");
                            });

                        });

                    });

                } else {
                    res.status(200).send("Você deverá responder o questionário após dois meses");
                }

            });
        }

    }
    return QuestController;
}