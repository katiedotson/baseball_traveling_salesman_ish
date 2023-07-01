// uses json/games_from_mlb_api.json to get unique stadium names
// puts output in json/stadiums.json

const fs = require('fs');
const uniqueVenues = new Set();
fs.readFile('json/games_from_mlb_api.json', 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the file:', err);
		return;
	}
	const dates = JSON.parse(data).dates;
	for (const day of dates) {
		for (const game of day.games) {
			uniqueVenues.add(game.venue.name);
		}
	}

	const uniqueVenueNames = Array.from(uniqueVenues);

	const stadiums = uniqueVenueNames.map(venue => {
		return { name: venue };
	});

	fs.writeFile(
		'json/stadiums.json',
		JSON.stringify({ stadiums }, null, 2),
		err => {
			if (err) {
				console.error('Error writing the file:', err);
				return;
			}
			console.log('Stadiums file written successfully');
		}
	);
});
