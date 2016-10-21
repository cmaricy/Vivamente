/*
* Importação do arquivo de configurações que contém algumas constantes
* que são usados em várias partes do aplicativo, tais como credenciais
* e endereços web.
*/
var cfg = require('../config.json');

/**
* Este script é responsável por fornecer o objeto com os parâmetros 
* de autorização com o Facebook.
* clientID: Identificação do aplicativo no developers.facebook.com
* clientSecret: Senha do aplicativo gerada no developers.facebook.com
* callbackURL: Endereço de redirecionamento após login aceito pelo Facebook
*/
module.exports = {
	'facebookAuth' : {
		'clientID' : cfg.CLIENT_ID,
		'clientSecret' : cfg.CLIENT_SECRET,
		'callbackURL' : 'https://frozen-thicket-68161.herokuapp.com/auth/facebook/callback'
	}
};
