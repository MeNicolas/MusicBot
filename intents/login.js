module.exports = (user, entities, resolve) => {
	const url = user.getSpotifyAuthUrl()
	
	resolve({
		txts: ['To link your Spotify account, please click on the link below.', url]
	})
}