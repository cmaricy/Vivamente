module.exports = function(app) {
		 
	var questionario = app.controllers.questionario;
 
	app.get('/', questionario.index);
	app.get('/questionario',  autenticar, questionario.indexQuestionario);
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
