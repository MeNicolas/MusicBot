const axios = require('axios')

module.exports = async (user, entities, resolve) => {
	try {
		try {
			const res = await axios.get('https://europe-west1-musixtory-cc822.cloudfunctions.net/musicbot', { params: { action: 'poweroff' }})
		} catch (err) {
			
		}
		
		resolve({txt: 'The recommendation server is stopping...'})
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
	
}