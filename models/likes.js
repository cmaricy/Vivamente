var mongoose = require('mongoose');
var likesSchema = mongoose.Schema({

	id_usuario: String,
	nome_usuario: String,
	likes : [{
		id: String,
		name: String,		
		created_time: Date
	}]	
	
});

module.exports = mongoose.model('likes', likesSchema);




