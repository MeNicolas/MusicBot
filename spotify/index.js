var SpotifyWebApi = require('spotify-web-api-node')
const config = require('../config')

module.exports = class Spotify {
	static api = new SpotifyWebApi(config.spotify)
	
	static async getApi() {
		return new Promise(async function(resolve, reject) {
			if (Spotify.api.getAccessToken() == null) {
				Spotify.api.clientCredentialsGrant().then(
					function(data) {
						console.log('The access token expires in ' + data.body['expires_in']);
						Spotify.api.setAccessToken(data.body['access_token']);
						resolve(Spotify.api)
					},
					function(err) {
						console.log('Something went wrong when retrieving an access token', err)
						reject(err)
					}
				)
			} else {
				resolve(Spotify.api)
			}
		})
	}
}