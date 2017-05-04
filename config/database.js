/*
* Importação do arquivo de configurações que contém algumas constantes
* que são usados em várias partes do aplicativo, tais como credenciais
* e endereços web.
*/
var cfg = require('../config.json');

/*
* Exportação da URI de conexão com MongoDB.
* cfg.USER_DB: Importa o valor de USER_DB contido no objeto cfg
* cfg.PASS_DB: Importa o valor de PASS_DB contido no objeto cfg
*/
module.exports = { 'url': 
			'mongodb://'+cfg.USER_DB+':'+cfg.PASS_DB+'@clusterviva-shard-00-00-dr7fo.mongodb.net:27017,clusterviva-shard-00-01-dr7fo.mongodb.net:27017,clusterviva-shard-00-02-dr7fo.mongodb.net:27017/vivamente?ssl=true&replicaSet=ClusterViva-shard-0&authSource=admin'};