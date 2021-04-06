if(process.env.NODE_ENV === 'production') {
	module.exports = {
		FB: {
			pageAccessToken: process.env.pageAccessToken ,
			verifyToken: process.env.verifyToken,
			appSecret: process.env.appSecret
		},
		spotify: {
			clientId: process.env.spotifyClientId,
			clientSecret: process.env.spotifyClientSecret
		},
		mongodb: process.env.mongodb
	}
} else {
	module.exports = require('./development.json');
}