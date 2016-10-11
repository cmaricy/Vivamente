var mongoose = require('mongoose');
var likesSchema = mongoose.Schema({

	name: String,
	id: String,
	created_time: String,
	id_usuario: String
	
});

module.exports = mongoose.model('likes', likesSchema);




