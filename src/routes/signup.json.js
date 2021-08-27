// @ts-check
export async function post({ body }) {
	console.log('posting new user:', body);

	const res = await fetch('http://localhost:4343/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	const json = await res.json();

	return {
		body: json
	};
}
