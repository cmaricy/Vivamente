/*
* Middlewares são funções que atuam como intermediárias que generalizam 
* tarefas que podem ser usadas globalmente. Este middleware generaliza
* o comportamente dos erros no site.
*/ 

// Em caso de pagina não encontrada (HTTP 404)
exports.notFound = function(req, res, next) {
  res.status(404);
  res.render('not-found');
};

// Em caso de erro no servidor (HTTP 500)
exports.serverError = function(error, req, res, next) {
  res.status(500);
  res.render('server-error', {error: error});
};