// @ts-check
export async function post({ body }) {
	// should have userId, phoneNumber fields
	console.log('adding phone:', body);

	const res = await fetch('http://localhost:4343/phone', {
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
