/*
* Este arquivo gerencias as rotas referente aos encaminhamentos do site
* feito pelo express. 
*/

module.exports = function(app) {
	
	// Carrega as funções do questionário controller pelo consign (antigo load)		 
	var questionario = app.controllers.questionario;
 
 	// Esta rota encaminha para a página inicial do site. Método POST é requerido pelo
 	// facebook canvas
	app.post('/', questionario.index);

	// Esta rota encaminha para a página do questionário, passando como middleware a 
	// função autenticar, que verifica se o usuário está logado ou não. Se for falso 
	// encaminha para a página inicial
	app.get('/questionario',  autenticar, questionario.indexQuestionario);

	// Esta rota é invocada ao salvar o questionário
	app.post('/questionario/salvar', autenticar, questionario.salvar);

	/*
	* Esta funcao verifica se existe algum usuario na sessao,
	* se existir permiti que o roteamento siga normalmente,
	* senão redireciona para a pagina inicial. 
	*/
	function autenticar(req, res, next){
	  if(!req.user) {
	    return res.redirect('/');
	  }
	  return next();
	}
		
};
