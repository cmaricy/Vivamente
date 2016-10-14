var mongoose = require('mongoose');
var postsSchema = mongoose.Schema({

	id_usuario: String,
	nome_usuario: String,
	posts: [{
		id: String,
		message: String,
		story: String,
		created_time: Date,
		link: String,
		place: String,
		tags: String,
		object_attachment: String
	}]
	
});

module.exports = mongoose.model('posts', postsSchema);




