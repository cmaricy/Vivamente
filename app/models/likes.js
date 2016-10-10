
var mongoose = require('mongoose');
var likesSchema = mongoose.Schema({

	like: {
		name: String,
		id: String,
		created_time: String,
		id_usuario: String
	}
});

module.exports = mongoose.model('likes', likesSchema);




