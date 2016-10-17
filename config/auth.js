var cfg = require('../config.json');
module.exports = {
	'facebookAuth' : {
		'clientID' : cfg.CLIENT_ID,
		'clientSecret' : cfg.CLIENT_SECRET,
		'callbackURL' : 'https://frozen-thicket-68161.herokuapp.com/auth/facebook/callback'
	}
};
