// builds the request bodies for the Google Maps Distance Matrix API
// https://developers.google.com/maps/documentation/distance-matrix/intro
// files are written to route-matrix-request-bodies/output_{index}.json

const fs = require('fs');

// Read the input file
fs.readFile('json/stadiums_and_locations.json', 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the file:', err);
		return;
	}

	try {
		const stadiums = JSON.parse(data);

		for (let i = 0; i < stadiums.length; i++) {
			const origins = [];
			const destinations = [];

			for (let j = 0; j < stadiums.length; j++) {
				const { lat, lng } = stadiums[j];

				if (i === j) {
					origins.push({
						waypoint: {
							location: {
								latLng: {
									latitude: lat,
									longitude: lng
								}
							}
						}
					});
				} else {
					destinations.push({
						waypoint: {
							location: {
								latLng: {
									latitude: lat,
									longitude: lng
								}
							}
						}
					});
				}
			}

			const result = {
				origins,
				destinations,
				travelMode: 'DRIVE'
			};

			// Write the result to a new file
			fs.writeFile(
				`route-matrix-request-bodies/output_${i}.json`,
				JSON.stringify(result, null, 2),
				err => {
					if (err) {
						console.error('Error writing the file:', err);
						return;
					}

					console.log(`Output file ${i} created successfully!`);
				}
			);
		}
	} catch (error) {
		console.error('Error parsing the JSON:', error);
	}
});
