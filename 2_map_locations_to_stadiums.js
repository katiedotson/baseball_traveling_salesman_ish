// maps lat/lng acquired from 1_get_locations_of_stadiums.js to stadiums.json
// writes the results to a json file in json/stadiums_and_locations.json

const fs = require('fs');

function mapToStadiums(locations, stadiums) {
	let stadiumsWithLocations = [];
	locations.forEach((element, index) => {
		let stadium = stadiums.stadiums[index];
		stadium.lat = element.lat;
		stadium.lng = element.lng;
		stadiumsWithLocations[index] = stadium;
	});

	return stadiumsWithLocations;
}

fs.readFile('json/stadium_locations.json', 'utf8', function (err, locations) {
	if (err) {
		console.error('Failed to read file. Error: ', err);
		return;
	}
	fs.readFile('json/stadiums.json', 'utf8', function (err, stadiums) {
		if (err) {
			console.error('Failed to read file. Error: ', err);
			return;
		}
		let jsonData = mapToStadiums(
			JSON.parse(locations),
			JSON.parse(stadiums)
		);
		fs.writeFile(
			'json/stadiums_and_locations.json',
			JSON.stringify(jsonData, null, 2),
			err => {
				if (err) {
					console.error('Failed to write file. Error: ', err);
					return;
				}
				console.log('File written successfully');
			}
		);
	});
});
