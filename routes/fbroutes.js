/*
* Este arquivo gerencias as rotas referente aos encaminhamentos do facebook
* feito pelo express. 
*/

module.exports = function(app, passport) {
 	
 	// Rota que autorização do usuário que o passport encaminha para o facebook
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope : [ 'email', 'user_likes', 'user_posts' ]
	})); 

	// Rota que é chamada após o retorno de login pelo facebook. Em caso de sucesso
	// redireciona para o questionario, senão redireciona para uma pagina de erro
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/questionario',
		failureRedirect : '/error'
	}));

};
