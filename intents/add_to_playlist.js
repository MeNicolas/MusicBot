module.exports = async (user, entities, resolve) => {
	try {
		let q = entities('name:name')
		const artist_name = entities('artist_name:artist_name')
		if (artist_name) q += ` artist:"${artist_name}"`
		
		let track = await user.api.searchTracks(q)
		track = track.body.tracks.items[0]
		
		if (track) {
			console.log(track)
			
			let playlists = await user.api.getUserPlaylists({limit: 50})
			playlists = playlists.body.items
			playlist = playlists.filter(p => p.name.toLowerCase() == entities('playlist:playlist').toLowerCase())[0]
			console.log(playlists.map(p => p.name.toLowerCase()))
			if (playlist) {
				await user.api.addTracksToPlaylist(playlist.id, [track.uri])
				resolve({txt: `I've added ${track.name} by ${track.artists[0].name} to ${playlist.name}.`})
			} else {
				resolve({txt: 'I cannot find this playlist.'})
			}
		} else {
			resolve({txt: 'I cannot find this track :/'})
		}
		
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
	
	
}