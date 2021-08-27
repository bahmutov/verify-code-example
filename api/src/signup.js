// @ts-check
const { makeConnection } = require('./db.config.js');
const { json } = require('micro');

module.exports = async function (req, res) {
	const body = await json(req);
	console.log('posting new user:', body);

	const connection = makeConnection();

	const userId = await new Promise((resolve, reject) => {
		connection.query('INSERT INTO users SET ?', body, function (error, results, fields) {
			if (error) {
				console.error(error);
				return reject(error);
			}
			console.log('New user id: %s', results.insertId);
			resolve(results.insertId);
		});

		connection.end();
	});

	return {
		userId
	};
};
