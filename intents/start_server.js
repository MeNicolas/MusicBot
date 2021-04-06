const axios = require('axios')

module.exports = async (user, entities, resolve) => {
	try {
		try {
			const res = await axios.get('https://europe-west1-musixtory-cc822.cloudfunctions.net/musicbot', { params: { action: 'poweron' }})
			
			resolve({txts: ['The recommendation server is starting up... This may take up to 5 minutes, please test others parts of the chatbot meanwhile.', 'Please say "stop server" when you are finished :)']})
		} catch (err) {
			resolve({txt: 'The server is starting...'})
		}
	} catch(err) {
		console.log(err)
		resolve({txt: 'An unexpected error happened. Please try again later.'})
	}
	
}