// Purpose: Make requests to Google's Distance Matrix API to get the travel times between each stadium

const fs = require('fs');
const axios = require('axios');
const key = process.env.API_KEY;

fs.readFile('json/stadiums_and_locations.json', 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the file:', err);
		return;
	}

	try {
		const stadiums = JSON.parse(data);

		const promises = stadiums.map((stadium, index) => {
			const requestBodyPath = `route-matrix-request-bodies/output_${index}.json`;
			const requestBody = JSON.parse(
				fs.readFileSync(requestBodyPath, 'utf8')
			);

			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				url: 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix',
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-FieldMask': 'destinationIndex,duration',
					'X-Goog-Api-Key': key
				},
				data: JSON.stringify(requestBody)
			};

			return axios
				.request(config)
				.then(response => response.data)
				.catch(error => {
					console.log(error);
				});
		});

		Promise.all(promises)
			.then(responses => {
				const results = responses.map((routes, index) => {
					const sortedRoutes = routes.sort((a, b) => {
						return a.destinationIndex - b.destinationIndex;
					});
					const routesWithIndex = sortedRoutes.map((route, index) => {
						route.index = index + 1;
						return route;
					});
					stadiums[index].routes = routesWithIndex;
					stadiums[index].index = index + 1;
					return stadiums[index];
				});
				fs.writeFile(
					'json/stadiums_and_routes.json',
					JSON.stringify(results, null, 2),
					err => {
						if (err) {
							console.error('Error writing the file:', err);
							return;
						}
					}
				);
			})
			.catch(err => console.error(err));
	} catch (err) {
		console.error(err);
	}
});
