# How to use these files

## Prerequisites

1. A Google Maps API key with route matrices and geocoding enabled. See the docs: https:developers.google.com/maps/documentation Store the key somewhere safe. Some scripts will require it to run.
2. Node.js installed on your environment.

## Scripts

### `0_build_stadiums_json.js`

Run this script to build `stadiums.json`, a list of unique stadiums needed to complete the other steps.

### `1_get_locations_of_stadiums.js`

Calls the google maps api to get the lat and long of each stadium, and writes the results to a json file in `json/stadium_locations.json`. NOTE: For some reason Google doesn't like the request for "Rogers Centre,"" so it will appear as `null` in the list of results. The lat, lng is: 43.641796, -79.390083 -- just add it manually.

Run with following command:

```bash

API_KEY="${YOUR_API_KEY}" node 1_get_locations_of_stadiums.js

```

### `2_map_locations_to_stadiums.js`

Maps lat/lng acquired from `1_get_locations_of_stadiums.js` to `stadiums.json` and writes the results to a json file in `json/stadiums_and_locations.json`

### `3_build_google_matrix_requests.js`

Builds the request bodies for the [Google Maps Distance Matrix API](https:developers.google.com/maps/documentation/distance-matrix/intro). Files are written to `route-matrix-request-bodies/output_{index}.json`

### `4_do_google_matrix_requests.js`

Makes the requests to Google's Distance Matrix API to get the travel times between each stadium. Puts the output in `json/stadiums_and_routes.json`.

```bash

API_KEY="${YOUR_API_KEY}" node 4_do_google_matrix_requests.js

```

### `5_cleanup_routes_map.js`

Creates a data structure that looks like this:

    [stadium]
        name
        lat
        lng
            [routes]
                name
                travel time in hours

By default, this only contains routes with travel times less than 16 hours.

### `6_map_games_schedule.js`

Read from `games_from_mlb_api.json` and create a simplified data structure, written to `json/games_schedule.json`

    {date, games: [{homeTeam, awayTeam, stadium}]}

### `7_find_games.js`

Finds the next game to watch based on the current stadium and the schedule.

1. Read from json/stadiums_and_locations.json
2. Read from json/games_schedule.json
3. Find the next game to watch based on the current stadium and the schedule
4. Write the results to json/games_watched.json

### Original Problem Statement

#### The Traveling Baseball Fan Problem

Taylor is a huge baseball fan. They’re such a huge baseball fan, in fact, that they’re going to take a sabbatical from work to see as many baseball teams as they can next year. The problem is they don’t know when and for how long they should take off in order to see the most teams. They want to see one game every day for as long as possible.

##### Taylor’s Plan

Travel to anywhere in the US and rent a car to begin their epic baseball journey, starting point doesn’t matter.
See a consecutive baseball game each and every day for as long as they possibly can.
Between games, travel for as much as 6 hours (driving), even through the night if needed!
End the trip at any point in the US, final location doesn’t matter.
If they end up doubling back to a place they’ve already been to, that’s okay – more baseball never hurt anyone!
The MLB has a JSON endpoint for scheduling - https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=2023-03-30&endDate=2023-10-01 - and the Google Maps API might give a good sense of how long it would take to travel among stadiums. Can we help Taylor out?
