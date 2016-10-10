
var mongoose = require('mongoose');
var feedSchema = mongoose.Schema({

	feed: {
		message: String,
		story: String,
		created_time: String, 
		id: String,
		id_usuario: String
	}
});

module.exports = mongoose.model('feeds', feedSchema);




