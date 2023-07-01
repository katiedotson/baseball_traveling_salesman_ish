// calls the google maps api to get the lat and long of each stadium
// writes the results to a json file in json/stadium_locations.json

const fs = require('fs');
const axios = require('axios');
const key = process.env.API_KEY;

fs.readFile('json/stadiums.json', 'utf8', (err, jsonString) => {
	if (err) {
		console.log('File read failed:', err);
		return;
	}

	const data = JSON.parse(jsonString).stadiums;

	const promises = data.map(item => {
		return axios
			.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${item.name}=&key=${key}`
			)
			.then(response => response.data)
			.catch(err => console.error(err));
	});

	Promise.all(promises)
		.then(responses => {
			const stadiumLocations = responses.map(response => {
				if (response.results.length > 0) {
					return response.results[0].geometry.location;
				}
			});
			fs.writeFile(
				'json/stadium_locations.json',
				JSON.stringify(stadiumLocations, null, 2),
				err => {
					if (err) {
						console.error('Failed to write file. Error: ', err);
						return;
					}
					console.log('File written successfully');
				}
			);
		})
		.catch(err => console.error(err));
});
