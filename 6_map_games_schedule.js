// read from games_from_mlb_api.json and create a simplified data structure
// write the simplified data structure to json/games_schedule.json
// data structure:
// {date, games: [{homeTeam, awayTeam, stadium}]}

const fs = require('fs');
fs.readFile('games_from_mlb_api.json', 'utf8', (err, data) => {
	if (err) {
		console.error('Error reading the file:', err);
		return;
	}

	try {
		const jsonData = JSON.parse(data).dates;
		const games = jsonData.map(date => {
			let games = date.games.map(game => {
				return {
					homeTeam: game.teams.home.team.name,
					awayTeam: game.teams.away.team.name,
					stadium: game.venue.name
				};
			});
			return { date: date.date, games: games };
		});

		fs.writeFile(
			'json/games_schedule.json',
			JSON.stringify(games, null, 2),
			err => {
				if (err) {
					console.error('Error writing the file:', err);
					return;
				}
			}
		);
	} catch (err) {
		console.error('Error parsing JSON string:', err);
	}
});
