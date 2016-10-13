var mongoose = require('mongoose');
var questionario = mongoose.Schema({

	id_usuario: String,
	nome: String,
	sexo: String,
	idade: Number,
	autoriza: String,
	created_time: String, 
	respostas : {
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
	}
		
});

module.exports = mongoose.model('questionarios', questionario);




