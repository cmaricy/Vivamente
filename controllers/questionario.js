/*
* Este script é responsável por atuar como controlador do fluxo 
* do questionário. Possui funções que são invocadas nas rotas do express
* que retornar os resultados para a rota.
*/
module.exports = function(app) {

    // Importação da biblioteca Facebook para node.js
    var FB = require('fb');

    // Importação do objeto que contém as constantes de configurãção
    var cfg = require('../config.json');

    // Importação da biblioteca moment.js que implementa funções que trabalham 
    // na manipulação de datas.
    var moment = require('moment');

    // Importação do modelo do Mongoose que representa a entidade Questionario
    var Quest = require('../models/questionario');

    // QuestController é o objeto que será retornado ao importar esse script. Dentro
    // desse objeto são declaradas as funções que serão utilizadas nas rotas.
    var QuestController = {

        /*
        * req e res são request and response respectivamente. São os objetos que contém
        * os métodos de request e response do express.
        */

        // Função que quando chamadada a rota default do site ('/'), irá redirecionar para
        // a autenticação do facebook
        index: function(req, res) {
            // res.redirect redireciona a chamada para pedir autenticação com o facebook
            res.redirect('/auth/facebook');
        },

        // Função que envia a página do questionário
        indexQuestionario: function(req, res) {
            // Renderiza a página questionário
            res.render('/questionario');
        },

        /* Função responsável por salvar o questionário, os posts e os likes do usuário.
        * Esta função recebe no corpo no request as respostas das questões selecionadas
        * e persiste no MongoDB. Visto que usuário está na sessão, usa as funções da biblioteca
        * do facebook para obter os posts e os likes, passando como argumento o ID do facebook
        * do usuário. Por fim, persiste na collection chamada questionarios as respostas do
        * questionario, os posts e os likes. 
        */
        salvar: function(req, res) {

            // Pesquisa no MongoDB por um questionário ja preenchido pelo usuário
            // passando como parâmetro o ID do facebook do usuário que está na sessão.
            Quest.findOne({
                'id_usuario': req.user.facebook.id
            }, function(err, quest) {

                // Interrompe a execução e retorna mensagem de erro, em caso de erro 
                // na consulta no MongoDB
                if (err) res.status(500).send("Erro ao consultar o usuário");

                // Se o usuário for encontrado, isto é, já tenha respondido o questionário
                if ( quest ) {
                    
                    // Verifica se o usuário já respondeu DUAS vezes, se for verdadeiro 
                    // interrompe a execução e retorna mensagem para o usuário
                    if (quest.respostas.length > 1) {
                        res.status(200).send("Usuário só pode responder duas vezes o questionário");
                    } 
                    
                    // Se o usuário respondeu somente UMA vez o questionário é calculado a quantidade
                    // de dias, para isso usa-se a biblioteca moment.js para obter a diferença entre duas
                    // datas e converter milissegundos (padrão de data em javascript) em dias
                    var diferenca = moment().diff(quest.created_time, new Date());
                    var duracao = new moment.duration(diferenca);
                    var dias = Math.ceil(duracao.asDays());
                    
                } else {
                    // Se o usuário ainda não tiver respondido o questionário é criado 
                    // uma instância para salvar o primeiro registro
                    quest = new Quest();
                }

                // O Questionario só será salvo se o usuário ainda não tiver respondido
                // ou se estiver respondendo pela segunda vez APÓS 60 dias (2 meses)
                if ( dias > 60 || quest.respostas.length == 0) {

                    // Preenche os campos do modelo Questionario com base no dados 
                    // presentes na sessão do usuário e no que foi preenchido na tela
                    quest.id_usuario = req.user.facebook.id;
                    quest.nome = req.user.facebook.name;
                    quest.sexo = req.body.sexo;
                    quest.idade = req.body.idade;
                    quest.autoriza = req.body.autoriza;
                    
                    // Preenche a data de criação somente na primeira resposta do questionario
                    if ( quest.respostas.length == 0 )
                        quest.created_time = new Date();

                    // Empilha as respostas no Array respostas do modelo Questionario
                    quest.respostas.push(req.body.respostas);

                    // O nivel é calculado iterando os valores das respostas checadas
                    // pelo usuário. O uso de idx é para obter o indíce da resposta em 
                    // foco (visto que usuário irá responder duas vezes, para saber se é 
                    // a primeira ou segunda vez)
                    var idx = quest.respostas.length - 1;
                    quest.respostas[idx].nivel = 0;
                    var nivel = 0;

                    var obj = req.body.respostas;
                    // Iterado as chaves do objeto Respostas
                    for ( var property in obj ) {
                        // acumula a somatório dos valores das respostas
                        nivel += parseFloat(obj[property]);
                    }

                    // Seta o valor do nível no objeto respostas que será salvo
                    quest.respostas[idx].nivel = nivel;

                    // Armazena a data que as respostas foram registradas
                    quest.respostas[idx].created_time = new Date();

                    // Obtém o token de acesso usando usando a biblioteca FB do node.js
                    FB.api('oauth/access_token', {
                        client_id: cfg.CLIENT_ID,
                        client_secret: cfg.CLIENT_SECRET,
                        grant_type: 'client_credentials'
                    }, function(token) {

                        // Se houver alguma falha na obtenção do token
                        // irá printar o erro no console e retorna erro ao usuário
                        if (!token || token.error) {
                            console.log(!res ? 'error occurred' : token.error);
                            return;
                        }

                        // Armazena o valor do token de acesso
                        var accessToken = token.access_token;

                        // Seta para o Facebook objeto o token de acesso que será
                        // usado nas chamadas das funções da Graph API do node.js
                        FB.setAccessToken(accessToken);

                        // Faz a chamada da URL que retorna os likes do usuário
                        // passando como parâmetro o ID do facebook
                        FB.api('/' + req.user.facebook.id + '/likes?limit=5000', {
                            access_token: accessToken
                        }, function(response) {

                            // Se houver algum erro no resultado irá retornar o erro
                            // ao usuário
                            if ( !response || response.error ) {
                                console.log(!response ? 'error occurred' : response.error);
                                return;
                            }

                            /* Se o usuário já tiver likes cadastrados, este bloco
                            * irá verificar se algum like que não está cadastrado foi 
                            * retornado, se verdadeiro adiciona somente os likes não 
                            * cadastrados ainda, assim não permite duplicados.
                            */ 
                            if ( quest.likes.length > 0 ) {

                                // response.data são o likes retonado pelo FB.api
                                response.data.forEach(function(item) {
                                    var aux = false;
                                    // quest.likes são os likes que usuário já possuem cadastrado
                                    quest.likes.forEach(function(itLike) {
                                        if (itLike.id == item.id) aux = true;
                                    });

                                    // Se o like não foi encontrado adiciona na lista
                                    if (aux == false) {
                                        quest.likes.push(item);
                                    }
                                });

                            } else {

                                // Se é primeiro cadastro adiciona todos os likes
                                // sem validações de duplicadas
                                response.data.forEach(function(item) {
                                    quest.likes.push(item);
                                });

                            }

                        }); // FIM do FB.api dos likes

                        // A lógica dos posts segue exatamente a mesma da dos likes, 
                        // incluindo a controle de duplicadas
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

                            // Após preencher os valores do questionário, empilhar os likes e 
                            // os posts, o questionário é salvo. Será mantido somente um documento
                            // por usuário, portanto se o documento já existe ele irá salvar (ou atualizar)
                            // o que já existe, senão ele salva um novo documento.
                            quest.save(function(err, data) {
                                if (err) res.status(500).send("Erro ao salvar o questionário");
                                res.status(200).send("Respostas enviadas com sucesso");
                            });

                        }); // Fim do FB.api dos posts

                    });// FIM do FB.api que obtem o token de acesso

                } else {
                    // Se a quantidade de dias for menor do que 60 irá redirecionar a mensagem ao usuário
                    // e nenhuma das etapadas de salvamento do questionário será realizada
                    res.status(200).send("Você deverá responder o questionário após dois meses");
                } // FIM do else se dias  > 60 

            }); // FIM do FindOne do Mongoose
        } // Fim da função salvar

    } // Fim do Obeto QuestController

    // Retorna o QuestController para quem invocar (var x = require('questionario'))
    return QuestController;
}