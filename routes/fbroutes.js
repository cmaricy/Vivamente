/*
* Este arquivo gerencias as rotas referente aos encaminhamentos do facebook
* feito pelo express. 
*/

module.exports = function(app, passport) {
 	
 	// Rota que autorização do usuário que o passport encaminha para o facebook
	app.get('/auth/facebook', passport.authenticate('facebook-canvas', {
		scope : [ 'email', 'user_likes', 'user_posts' ]
	})); 

	app.post('/auth/facebook/canvas', passport.authenticate('facebook-canvas', { successRedirect: '/',
                                             failureRedirect: '/auth/facebook/canvas/autologin' }));	

	app.get('/auth/facebook/canvas/autologin', function( req, res ){
	  res.send( '<!DOCTYPE html>' +
	              '<body>' +
	                '<script type="text/javascript">' +
	                  'top.location.href = "/auth/facebook";' +
	                '</script>' +
	              '</body>' +
	            '</html>' );
	});	

	// Rota que é chamada após o retorno de login pelo facebook. Em caso de sucesso
	// redireciona para o questionario, senão redireciona para uma pagina de erro
	app.get('/auth/facebook/callback', passport.authenticate('facebook-canvas', {
		successRedirect : '/questionario/',
		failureRedirect : '/error'
	}));

};
