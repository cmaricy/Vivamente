var mongoose = require('mongoose');
var questionario = mongoose.Schema({

	id_usuario: String,
	nome: String,
	sexo: String,
	idade: Number,
	autoriza: String,
	created_time: Date,
	likes : [{
		id: String,
		name: String,		
		created_time: Date
	}],
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
		
});

module.exports = mongoose.model('questionarios', questionario);




