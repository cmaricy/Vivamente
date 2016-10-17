/*
* Este script representa o modelo de dados questionario
* que será manipulado pelo Mongoose.
*/

// Importa a biblioteca mongoose
var mongoose = require('mongoose');

// Cria um Schema que será armazenado na variavél questionario.
// Um schema será um documento no MongoDB.
var questionario = mongoose.Schema({

	// Campos iniciais do questionario
	id_usuario: String,
	nome: String,
	sexo: String,
	idade: Number,
	autoriza: String,
	created_time: Date,

	// Array de likes. Um Array que é composto por objetos. Cada objeto
	// representa um like retornado pelo FB API
	likes : [{
		id: String,
		name: String,		
		created_time: Date
	}],

	// Array de posts. Um Array que é composto por objetos. Cada objeto
	// representa um post retornado pelo FB API
	posts: [{
		id: String,
		message: String,
		story: String,
		created_time: Date,
		link: String,
		place: String,
		tags: String,
		object_attachment: String
	}],	

	// Array de respostas. Um Array que é composto por objetos. Cada objeto
	// representa uma ação do usuário em responder o questionário. Usa-se Array 
	// de objetos pois o usuário irá responder o questionário duas vezes, portanto
	// cada indíce do Array representa uma ação de resposta. Foi estruturado dessa 
	// forma para não haver redundância
	respostas : [{
		created_time: Date, 
		nivel: Number,
		agitacao : String,
		apetite : String,
		choro : String,
		concentracao : String,
		critica : String,
		culpa : String,
		desvalorizacao : String,
		energia : String,
		estima : String,
		fadiga : String,
		fracasso : String,
		indecisao : String,
		int_sexo : String,
		interesse : String,
		irritabilidade : String,
		pessimismo : String,
		prazer : String,
		punicao : String,
		sono : String,
		suicida : String,
		tristeza : String
	}]
		
}); // Fim do Schema questionario

// Exporta o modelo de documento chamada questionario que será 
// armazenado na collection chamada questionarios
module.exports = mongoose.model('questionarios', questionario);




