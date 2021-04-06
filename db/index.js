const MongoClient = require('mongodb');
const config = require('../config')

const MONGODB_DB_NAME = 'musicbot';
const MONGODB_URI = config.mongodb;

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
module.exports.getDB = async function getDB() {
  try {
	if (database) return database;

	client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
	database = client.db(MONGODB_DB_NAME);

	return database;
  } catch (error) {
	console.error('🚨 MongoClient.connect...', error);
	return null;
  }
};

/**
 * Close the connection
 */
module.exports.close = async function close() {
  try {
	await client.close();
  } catch (error) {
	// console.error('🚨 MongoClient.close...', error);
  }
};