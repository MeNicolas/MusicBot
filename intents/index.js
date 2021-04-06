var intents = require('require-all')(__dirname);

const extractEntity = (nlp, entity) => {
	if (entity == 'intent') {
		return nlp.intents.sort((a, b) => b.confidence-a.confidence)[0]?.name
	} else {
		return (nlp.entities[entity] || [])[0]?.value
	}
}

module.exports = (user, nlpData) => {
	return new Promise(async function(resolve, reject) {
		let intent = extractEntity(nlpData, 'intent')?.replace('wit$', '')
		console.log(nlpData, intent)
		
		if(intent && intents[intent] != null) {
			intents[intent](user, entity => extractEntity(nlpData, entity), resolve)
		} else {
			resolve({txt: "I’m not sure I understand you!"})
		}
	});
}