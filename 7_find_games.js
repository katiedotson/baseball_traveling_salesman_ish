// Purpose: Find the next game to watch based on the current stadium and the schedule
// 1. Read from json/stadiums_and_locations.json
// 2. Read from json/games_schedule.json
// 3. Find the next game to watch based on the current stadium and the schedule
// 4. Write the results to json/games_watched.json

const fs = require('fs');

let gamesWatched = [];
let stadiumVisits = {};
let currentStadium = { name: 'Kauffman Stadium' };

function buildWatchedGame(date, stadium, game) {
	return {
		date,
		stadium,
		homeTeam: game.homeTeam,
		awayTeam: game.awayTeam
	};
}

function findNextGame(i, stadiums, schedule) {
	if (i >= schedule.length) {
		saveGames();
		return;
	}

	let nextDaySchedule = schedule.find(
		day =>
			new Date(day.date).getTime() >= new Date(schedule[i].date).getTime()
	);

	if (!nextDaySchedule || nextDaySchedule.games.length === 0) {
		findNextGame(i + 1, stadiums, schedule);
		return;
	}

	let matchingStadium = stadiums.find(
		stadium =>
			stadium.name.toLowerCase() === currentStadium.name.toLowerCase()
	);

	let sortedRoutes = matchingStadium.routes.sort((a, b) => {
		let aVisits = stadiumVisits[a.name] || 0;
		let bVisits = stadiumVisits[b.name] || 0;

		return aVisits - bVisits;
	});

	let nextStadiumAndGame = sortedRoutes
		.map(route => ({
			stadium: route,
			game: nextDaySchedule.games.find(
				game => game.stadium.toLowerCase() === route.name.toLowerCase()
			)
		}))
		.find(item => item.game != null);

	if (nextStadiumAndGame) {
		currentStadium = nextStadiumAndGame.stadium;
		stadiumVisits[currentStadium.name] =
			(stadiumVisits[currentStadium.name] || 0) + 1;
		gamesWatched.push(
			buildWatchedGame(
				nextDaySchedule.date,
				currentStadium,
				nextStadiumAndGame.game
			)
		);
	}

	findNextGame(i + 1, stadiums, schedule);
}

function saveGames() {
	fs.writeFile(
		'json/games_watched.json',
		JSON.stringify(gamesWatched, null, 2),
		err => {
			if (err) {
				console.error('Error writing the file:', err);
				return;
			}
			console.log('Done!');
		}
	);
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

				stadiumVisits[currentStadium.name] = 1;
				gamesWatched.push(
					buildWatchedGame(
						schedule[0].date,
						currentStadium,
						schedule[0].games.find(
							game =>
								game.stadium.toLowerCase() ===
								currentStadium.name.toLowerCase()
						)
					)
				);

				findNextGame(1, stadiums, schedule);
			}
		);
	}
);
