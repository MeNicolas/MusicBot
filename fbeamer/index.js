'use strict'
const crypto = require('crypto')
const request = require('request')
const apiVersion = 'v6.0'

class FBeamer{
	pageAccessToken
	verifyToken
	appSecret
	
	constructor({pageAccessToken , verifyToken, appSecret}){
		this.pageAccessToken = pageAccessToken
		this.verifyToken = verifyToken
		this.appSecret = appSecret
	}
	
	registerHook(req, res) {
		let mode = req.query['hub.mode'];
		let token = req.query['hub.verify_token'];
		let challenge = req.query['hub.challenge'];
		
		// Checks if a token and mode is in the query string of the request
		if (mode && token) {
			// Checks the mode and token sent is correct
			if (mode === 'subscribe' && token === this.verifyToken) {
				// Responds with the challenge token from the request
				console.log('WEBHOOK_VERIFIED');
				res.status(200).send(challenge);
			} else {
				res.sendStatus(403);      
			}
		}
		else res.sendStatus(403);
	}
	
	
	verifySignature(req, res, buf) {
		return (req, res, buf) => {
			if(req.method === 'POST') {
				try {
					const sig = req.headers['x-hub-signature'].replace(/sha1=/, '')
					let tempo_hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8');
					let hash = tempo_hash.digest('hex');

					if (sig !== hash) throw 'Mismatch signature'
				} catch (e) {
					console.log(e);
				}
			}
		} 
	}
	
	incoming(req, res, cb) {
		res.sendStatus(200);
		// Extract the body of the POST request
		if(req.body.object === 'page' && req.body.entry) {
			let data = req.body
			for (let page of data.entry) {
				for (let messageObj of page.messaging) {
					if(messageObj.postback) {
						
					} else{
						return cb(messageObj)
					}
				}
			}
		}
	}
	
	messageHandler(obj){
		let sender = obj.sender.id
		let message = obj.message
		if (message.text){
			let obj = {
				sender,
				type: 'text',
				content : message.text,
				nlp: message.nlp
			}
			return obj
		}
	}
	
	
	sendMessage(payload){
		return new Promise((resolve, reject) => { request ({
				uri: `https://graph.facebook.com/${apiVersion}/me/messages`,
				qs: {
					access_token: this.pageAccessToken
				},
				method: 'POST',
				json: payload
			},
			(error , response , body) => {
				if(!error && response.statusCode === 200){
					resolve({
						mid: body.message_id
					})
				} else {
					console.log(body, error)
					reject(error)
				}
			});
		});
	}
	
	txt(id, text, messaging_type = 'RESPONSE'){
		let obj = {
			messaging_type,
			recipient: { id },
			message: { text }
		}
		return this.sendMessage(obj)
	}
	
	img(id, url, messaging_type = 'RESPONSE'){
		let obj = {
			messaging_type,
			recipient: { id },
			message: { 
				attachment:{
					type: "image",
					payload: { url }
				}
			}
		}
		return this.sendMessage(obj)
	}
}

module.exports = FBeamer;