module.exports = async (user, entities, resolve) => {
	try {
		let q = entities('name:name')
		const artist_name = entities('artist_name:artist_name')
		if (artist_name) q += ` artist:"${artist_name}"`
		
		let track = await user.api.searchTracks(q)
		track = track.body.tracks.items[0]
		
		if (track) {
			let id = track.uri.replace('spotify:track:', '')
			await user.api.removeFromMySavedTracks([id])
			
			resolve({txt: `I've removed ${track.name} by ${track.artists[0].name} from your saved tracks.`})
		} else {
			resolve({txt: 'I cannot find this track :/'})
		}
		
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
	
	
}