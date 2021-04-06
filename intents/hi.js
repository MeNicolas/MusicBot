module.exports = (user, entities, resolve) => {
	resolve({
		txts: [
			'Hi ! I am your Spotify assistant.',
			'First, say "login" to link your Spotify account.',
			'Then, say "start server" to start the recommendation server.'
		]
	})
}