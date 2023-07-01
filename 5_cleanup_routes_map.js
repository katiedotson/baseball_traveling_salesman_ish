// create a data structure that looks like this:
// stadium
// 	- name
// 	- lat
// 	- lng
// 	- routes
// 		- name
// 		- travel time in hours

// only contains those with travel times less than 16 hours

const fs = require('fs');
fs.readFile('json/stadiums_and_routes.json', 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the file:', err);
		return;
	}

	try {
		const stadiums = JSON.parse(data);

		const stadiumsWithRoutes = stadiums.map((stadium, stadiumIndex) => {
			const routes = stadium.routes.map((route, index) => {
				if (!route.duration) {
					return;
				}
				const seconds = Number(route.duration.slice(0, -1));
				const hours = seconds / 3600;

				if (hours > 16) {
					return;
				}

				const stadiumInx = index >= stadiumIndex ? index + 1 : index;
				return {
					name: stadiums[stadiumInx].name,
					travelTime: hours
				};
			});

			const nonNullRoutes = routes.filter(route => route);
			const sortedByTravelTime = nonNullRoutes.sort(
				(a, b) => a.travelTime - b.travelTime
			);

			return {
				name: stadium.name,
				lat: stadium.lat,
				lng: stadium.lng,
				routes: sortedByTravelTime
			};
		});

		fs.writeFile(
			'json/stadiums_and_routes_clean.json',
			JSON.stringify(stadiumsWithRoutes, null, 2),
			err => {
				if (err) {
					console.error('Error writing the file:', err);
					return;
				}
				console.log('File written successfully');
			}
		);
	} catch (err) {
		console.error(err);
	}
});
