const spotify = require('../spotify')
const axios = require('axios')

module.exports = async (user, entities, resolve) => {
	try {
		const api = await spotify.getApi()
		
		let q = entities('name:name')
		const artist_name = entities('artist_name:artist_name')
		if (artist_name) q += ` artist:"${artist_name}"`
		
		let track = await api.searchTracks(q, {country: 'US'})
		track = track.body.tracks.items[0]
		console.log(q)
		if (track) {
			console.log(track)
			
			const res = await axios.get('http://51.15.206.54', { params: { name: track.name, artist: track.artists[0].name } });
			let ids = res?.data?.map(uri => uri.replace('spotify:track:', ''))
			
			if (ids && ids.length > 0) {
				let tracks = await api.getTracks(ids, {country: 'US'})
				tracks = tracks.body.tracks
				
				resolve({
					txts: [
						`Here are similar music to ${track.name} - ${track.artists[0].name}`,
						tracks.map(t => `${t.name} - ${t.artists[0].name}`).join(', ')
					]
				})
			} else {
				resolve({
					txt: 'This song is not in the dataset so I can\'t offer you recommendations :/'
				})
			}
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