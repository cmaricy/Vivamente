module.exports = function(app, passport) {
		 
	var questionario = app.controllers.questionario;
 
	app.get('/', questionario.index);

	app.get('/profile', function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/questionario/salvar', questionario.salvarFeedsEPosts);

	app.get('/questionario', questionario.indexQuestionario);
};
