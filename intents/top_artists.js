module.exports = async (user, entities, resolve) => {
	try {
		let artists = await user.api.getMyTopArtists({limit: 5})
		artists = artists.body.items.map(t => t.name)
		
		resolve({txts: [
			'Here is your 5 favorite artists :',
			artists.join(', ')
		]})
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
}