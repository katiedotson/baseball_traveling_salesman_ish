// Purpose: Find the next game to watch based on the current stadium and the schedule
// 1. Read from json/stadiums_and_locations.json
// 2. Read from json/games_schedule.json
// 3. Find the next game to watch based on the current stadium and the schedule
// 4. Write the results to json/games_watched.json

const fs = require('fs');

let currentStadium = {};
let gamesWatched = [];
let stadiumVisits = {};

function buildWatchedGame(date, stadium, schedule) {
	const game = schedule
		.find(day => day.date === date)
		.games.find(
			game => game.stadium.toLowerCase() === stadium.name.toLowerCase()
		);
	return {
		date,
		stadium,
		homeTeam: game.homeTeam,
		awayTeam: game.awayTeam
	};
}

function findNextGame(currentDate, stadiums, schedule) {
	let nextDayGames = schedule.find(
		day =>
			new Date(day.date).getTime() ===
			new Date(currentDate).getTime() + 86400000
	);
	if (!nextDayGames) return null;

	let matchingStadium = stadiums.find(
		stadium =>
			stadium.name.toLowerCase() === currentStadium.name.toLowerCase()
	);

	let sortedRoutes = matchingStadium.routes.sort((a, b) => {
		let aVisits = stadiumVisits[a.name] || 0;
		let bVisits = stadiumVisits[b.name] || 0;

		return aVisits - bVisits;
	});

	let nextStadium = sortedRoutes.find(route =>
		nextDayGames.games.find(
			game => game.stadium.toLowerCase() === route.name.toLowerCase()
		)
	);

	return nextStadium;
}

fs.readFile(
	'json/stadiums_and_routes_clean.json',
	'utf-8',
	(err, stadiumsUnparsed) => {
		if (err) {
			console.error('Error reading the file:', err);
			return;
		}
		fs.readFile(
			'json/games_schedule.json',
			'utf-8',
			(err, scheduleUnparsed) => {
				if (err) {
					console.error('Error reading the file:', err);
					return;
				}

				let stadiums = JSON.parse(stadiumsUnparsed);
				let schedule = JSON.parse(scheduleUnparsed);

				for (let i = 0; i < schedule.length; i++) {
					if (i === 0) {
						currentStadium = { name: 'Kauffman Stadium' };
						stadiumVisits[currentStadium] = 1;

						gamesWatched.push(
							buildWatchedGame(
								schedule[i].date,
								currentStadium,
								schedule
							)
						);
					} else {
						currentStadium = findNextGame(
							schedule[i - 1].date,
							stadiums,
							schedule
						);

						if (currentStadium) {
							stadiumVisits[currentStadium.name] =
								(stadiumVisits[currentStadium.name] || 0) + 1;

							gamesWatched.push(
								buildWatchedGame(
									schedule[i].date,
									currentStadium,
									schedule
								)
							);
						} else {
							fs.writeFile(
								'json/games_watched.json',
								JSON.stringify(gamesWatched, null, 2),
								err => {
									if (err) {
										console.error(
											'Error writing the file:',
											err
										);
										return;
									}
									console.log('Done!');
								}
							);
							break;
						}
					}
				}
			}
		);
	}
);
