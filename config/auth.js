var cfg = require('../config.json');
module.exports = {
	'facebookAuth' : {
		'clientID' : cfg.CLIENT_ID,
		'clientSecret' : cfg.CLIENT_SECRET,
		'callbackURL' : 'https://aqueous-basin-41147.herokuapp.com/auth/facebook/callback'
	}
};
