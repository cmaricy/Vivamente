var cfg = require('../config.json');
module.exports = {
	'facebookAuth' : {
		'clientID' : cfg.CLIENT_ID,
		'clientSecret' : cfg.CLIENT_SECRET,
		'callbackURL' : 'http://localhost:3001/auth/facebook/callback'
	}
};
