'use strict';
const express = require('express');
const server = express();
const PORT = process.env.PORT || 80;

const config = require('./config');
const FBeamer = require('./fbeamer');
const intents = require('./intents');
const User = require('./user');
const bodyparser = require('body-parser');

const f = new FBeamer(config.FB);
server.get('/webhook', (req, res) => f.registerHook(req, res));
server.post('/webhook', bodyparser.json({
	verify: f.verifySignature.call(f)
}))
server.post('/webhook', (req, res, next) =>{
	return f.incoming(req, res, async data => {
		data = f.messageHandler(data)
		try {
			const user = await User.fromId(data.sender)
			let response = await intents(user, data.nlp)

			if (response.txt) await f.txt(data.sender, response.txt)
			if (response.txts) {
				for (let txt of response.txts)
					await f.txt(data.sender, txt)
			}
			if (response.img) await f.img(data.sender, response.img)
		}
		catch(e){
			console.log(e);
		}
	})
})

server.get('/spotify/callback', async (req, res) => {
	console.log(req.query)
	const user = await User.fromId(req.query.state)
	await user.setSpotify(req.query.code)
	await f.txt(user.doc._id, 'Your Spotify account is now linked.')
	res.status(200).send('You logged in successfully, please go back to Messenger.')
})

server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));
