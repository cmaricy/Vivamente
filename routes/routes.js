module.exports = function(app, passport) {
		 
	var questionario = app.controllers.questionario;
 
	app.get('/', questionario.index);
	app.get('/profile', questionario.perfil);
	app.get('/questionario/salvar', questionario.salvarFeedsEPosts);
	app.get('/questionario', questionario.indexQuestionario);
	
};
