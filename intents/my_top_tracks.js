module.exports = async (user, entities, resolve) => {
	try {
		let tracks = await user.api.getMyTopTracks({limit: 5})
		tracks = tracks.body.items.map(t => t.name)
		
		resolve({txts: [
			'Here is your 5 favorite tracks :',
			tracks.join(', ')
		]})
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
}