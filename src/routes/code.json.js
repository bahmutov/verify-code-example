// @ts-check
export async function post({ body }) {
	console.log('verification code:', body);

	const res = await fetch('http://localhost:4343/code', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
	const json = await res.json();
	console.log('verification code response:', json);

	return {
		body: json
	};
}
