const spotify = require('../spotify')

module.exports = async (user, entities, resolve) => {
	try {
		const api = await spotify.getApi()
		let artist = await api.searchArtists(entities('name:name'))
		artist = artist.body.artists.items[0]
		let tracks = await api.getArtistTopTracks(artist.id, 'FR')
		tracks = tracks.body.tracks.map(t => t.name).slice(0, 5)
		
		console.log(artist)
		if (artist) {
			resolve({
				txts: [
					'Here is what I found :',
					`${artist.name}'s popularity is ${artist.popularity}%`,
					`Here are his/her top tracks :`,
					...tracks
				],
				img: artist.images[0].url
			})
		} else {
			resolve({
				txt: 'I cannot find '+entities('name:name')+' :('
			})
		}
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
	
	
}