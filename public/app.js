"use strict"

const MOCK_TRIPS = {
	"trips": [
		{
			"id": "111",
			"contributedBy": "Tenzing Norgay",
  			"name": "Bull of the woods wilderness with swimming pool",
  			"map": {},
  			"location": {
  				"longAndLat": "45.5122° N, 122.6587° W",
  				"state": "OR"
  				},
  			"nights": 1,
  			"totalMiles": 4.7,
  			"shortDescription": "A short hike in to a camp spot on the top of a rocky ledge overlooking a beautiful swim spot",
  			"longDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  			"features": ["swimming spot", "old-growth trees", "wilderness"],
  			"comments": [{
  				"contributedBy": "Meryl Streep",
  				"dateAdded": "April 4th 2016",
  				"content": "Fires in the area have made some of the trail diffcult, but besides that great trip!"
  			},
  			{
  				"contributedBy": "Keanu Reeves",
  				"dateAdded": "June 4th 2018",
  				"content": "So beautiful!"
  			}]
		},
		{
			"id": "222",
			"contributedBy": "Edmund Hillary",
  			"name": "Rainer Loop",
  			"map": {},
  			"location": {
  				"longAndLat": "46.8523° N, 121.7603° W",
  				"state": "OR"
  				},
  			"nights": 2,
  			"totalMiles": 28,
  			"shortDescription": "Beautiful and strenuos loop that includes ravines, rivers, the lowest elevation glacier in the nation, a suspension bridge, and wildflowers",
  			"longDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  			"features": ["glacier", "old-growth trees", "views"],
  			"comments": [{
  				"contributedBy": "Cuba Gooding Jr.",
  				"dateAdded": "September 4th 2014",
  				"content": "The suspension bridge was scary"
  			}]
		},
		{
			"id": "333",
			"contiributedBy": "Tenzing Norgay",
  			"name": "Waldo Lake",
  			"map": {},
  			"location": {
  				"longAndLat": "43.7270° N, 122.0445° W",
  				"state": "OR"
  				},
  			"nights": 1,
  			"totalMiles": 4,
  			"shortDescription": "Easy flat hike in to a beautfil edge of the lake campspot",
  			"longDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  			"features": ["lake"],
  			"comments": []
		},
		{
			"id": "444",
			"contiributedBy": "Lewis Clark",
  			"name": "Final Stretch of PCT",
  			"map": {},
  			"location": {
  				"longAndLat": "45.6623° N, 121.9011° W",
  				"state": "WA"
  				},
  			"nights": 7,
  			"distance": 80,
  			"shortDescription": "Climb peaks and enjoy the PNW in all it's glory",
  			"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  			"features": [],
  			"comments": []
		}

	]
}

const MOCK_USERS = {
	"users": [
		{
			"userName": "tnorgay",
	  		"firstName": "Tenzing",
	  		"lastName": "Norgay",
	  		"password": "everest",
	  		"tripsPosted": [{
	  				"id": "111"
	  			},
		  		{
		  			"id": "333"
		  		}
	  		]
	  	},
	  	{
			"userName": "ehillary",
	  		"firstName": "Edmund",
	  		"lastName": "Hillary",
	  		"password": "everest",
	  		"tripsPosted": [{
	  			"id": "222"
	  		}]
	  	},
	  	{
			"userName": "lclark",
	  		"firstName": "Lewis",
	  		"lastName": "Clark",
	  		"password": "america",
	  		"tripsPosted": [{
	  			"id": "444"
	  		}]
	  	},	

	]
}

const MOCK_COMMENTS = {
	"comments": [
		{
			"tripId": "111",
  			"contributedBy": "Meryl Streep",
  			"dateAdded": "April 4th 2016",
  			"content": "Fires in the area have made some of the trail diffcult, but besides that great trip!"
  		},
  		{
			"tripId": "111",
			"contributedBy": "Keanu Reeves",
			"dateAdded": "June 4th 2018",
			"content": "So beautiful!"
  		},
  		{
  			"contributedBy": "Cuba Gooding Jr.",
  			"dateAdded": "September 4th 2014",
  			"content": "The suspension bridge was scary"
  		}
	]
} 

//    Getting Trips and comments

function getTrips(callback) {
  // setTimeout(function(){ callback(MOCK_TRIPS)}, 100);
  $.getJSON('http://localhost:8080/trips', callback);
}

function displayTripsHTML(trip) {
  return `
  <p>${trip.name}</p>
  `
}

function displayComments(comment) {
  return `<p class="comments" hidden>${comment.content}</p>`
}

function displayTrips(data) {
  const results = data.trips.map((trip) => displayTripsHTML(trip));
  const comments = data.trips[0].comments.map(comment => displayComments(comment)).join('');
  $('.trips').append(results);
  $('.trip-details-results').html(`
    <h3>${data.trips[0].name}</h3>
      <p>${data.trips[0].shortDescription}</p>
      <p>${data.trips[0].longDescription}</p>
      <p>Contributed by: ${data.trips[0].contributedBy}</p>
      <p>${data.trips[0].location.longAndLat}</p>
      <p>${data.trips[0].nights} night(s)</p>
      <p>${data.trips[0].totalMiles} miles</p>
      <p>Features: ${data.trips[0].features}</p>
    <h2 class="comments" hidden>Comments</h2>  
      <p class="comments" hidden>${comments}</p>
      `);
}

function handleClickForComments(data) {
  $('.trip-details').on('click', '.show-comments', function(data) {
    $('.comments').prop('hidden', false);
    $('.show-comments').replaceWith(`<button type="click" class="hide-comments">Hide Comments</button>`);
  });
}

function handleClickToHideComments() {
  $('.trip-details').on('click', '.hide-comments', function(event) {
    event.preventDefault();
    $('.comments').prop('hidden', true);
    $('.hide-comments').replaceWith(`<button class="show-comments" type='click'>Show Comments</button>`);
    console.log('hiding comments');
  })
}

function getAndDisplayTrips() {
  getTrips(displayTrips);
}

//    Get users

function getUsers(callback) {
  setTimeout(function(){ callback(MOCK_USERS)}, 100);
}

function displayUsersHTML(user) {
  return `
  <p>${user.firstName} ${user.lastName}</p>
  `
}

function displayUsers(data) {
  const results = data.users.map((user) => displayUsersHTML(user));
  $('.users').append(results);
}

function getAndDisplayUsers() {
  getUsers(displayUsers);
}

//    Get one user profile

function getUserProfile(callback) {
  setTimeout(function(){ callback(MOCK_USERS)}, 100);
}

function translateTripId(tripId) {
  for(let i=0; i<MOCK_TRIPS.trips.length; i++) {
    if(MOCK_TRIPS.trips[i].id === tripId.id) {
      return `<p>${MOCK_TRIPS.trips[i].name}</p>`
    }
  }
}  

function displayUserProfile(data) {
  const idOfTripsPosted = data.users[0].tripsPosted;
  const tripsNamesPosted = idOfTripsPosted.map(tripId => translateTripId(tripId)).join('');
  $('.user-profile').append(`
    <p>${data.users[0].firstName} ${data.users[0].lastName}</p>
    <p>${tripsNamesPosted}</p>
    `);
}

function getAndDisplayProfile() {
  getUserProfile(displayUserProfile);
}

$(getAndDisplayProfile);
$(getAndDisplayTrips);
$(getAndDisplayUsers);
$(handleClickForComments);
$(handleClickToHideComments);









