import { makeConnection } from '../src/db.config.js';
const connection = makeConnection();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
// 	if (error) throw error;
// 	console.log('The solution is: ', results[0].solution);
// });

// connection.query(
// 	{
// 		sql: 'SELECT ? + ? AS solution',
// 		values: [1, 2]
// 	},
// 	function (error, results, fields) {
// 		if (error) {
// 			console.error(error);
// 			throw error;
// 		}
// 		console.log('The solution is: ', results[0].solution);
// 	}
// );

const user = {
  username: 'joe',
  email: 'joe@example.com'
};
connection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log('New user id: %s', results.insertId);
});

connection.end();
