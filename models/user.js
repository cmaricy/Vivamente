/*
* Este script representa o modelo de dados userSchema
* que será manipulado pelo Mongoose.
*/

// Importa a biblioteca mongoose
var mongoose = require('mongoose');

// Cria um Schema que será armazenado na variavél userSchema.
// Um schema será um documento no MongoDB.
var userSchema = mongoose.Schema({

	// Campos do userSchema
	facebook: {
		id: String,
		token: String,
		email: String, 
		name: String
	}
});

// Exporta o modelo de documento chamada userSchema que será 
// armazenado na collection chamada UserDB
module.exports = mongoose.model('UserDB', userSchema);