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
			'mongodb://'+cfg.USER_DB+':'+cfg.PASS_DB+'@olympia.modulusmongo.net:27017/Xepoh4yj'};
		
		
