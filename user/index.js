const { getDB } = require('../db')
var SpotifyWebApi = require('spotify-web-api-node')
const config = require('../config')

module.exports = class User {
	doc = null
	api = null
	
	constructor(doc) {
		this.doc = doc
		
		this.api = new SpotifyWebApi({
		  redirectUri: 'https://98a8b1563207.ngrok.io/spotify/callback',
		  clientId: config.spotify.clientId,
		  clientSecret: config.spotify.clientSecret
		})
		
		if (doc.spotify.accessToken) {
			this.api.setAccessToken(doc.spotify.accessToken)
			this.api.setRefreshToken(doc.spotify.refreshToken)
		}
	}
	
	static async fromId(id) {
		const db = await getDB()
		const user = await db.collection('users').findOne({_id: id})
		if (user == null) {
			const doc = {
				_id: id,
				spotify: {
					accessToken: null,
					refreshToken: null
				}
			}
			
			await db.collection('users').insertOne(doc)
			
			return new User(doc)
		} else {
			const u = new User(user)
			await u.api.refreshAccessToken().then(data => u.api.setAccessToken(data.body['access_token']), console.log);
			return u
		}
	}
	
	getSpotifyAuthUrl() {
		return this.api.createAuthorizeURL(['user-modify-playback-state', 'user-read-playback-state', 'playlist-modify-public', 'playlist-modify-private', 'user-library-modify', 'user-library-read', 'user-read-recently-played', 'user-top-read'], this.doc._id);
	}
	
	async setSpotify(code) {
		try {
			const data = await this.api.authorizationCodeGrant(code)
			
			this.doc.spotify = {
				accessToken: data.body['access_token'],
				refreshToken: data.body['refresh_token']
			}
			
			const db = await getDB()
			await db.collection('users').replaceOne({_id: this.doc._id}, this.doc)
		} catch (err) {
			console.log(err)
		}
	}
}