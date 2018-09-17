"use strict"

const TRIPS_SEARCH_URL = 'http://localhost:8080/trips';
const USERS_SEARCH_URL = 'http://localhost:8080/users';


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
			"contributedBy": "Tenzing Norgay",
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
			"contributedBy": "Lewis Clark",
  			"name": "Final Stretch of PCT",
  			"map": {},
  			"location": {
  				"longAndLat": "45.6623° N, 121.9011° W",
  				"state": "WA"
  				},
  			"nights": 7,
  			"totalMiles": 80,
  			"shortDescription": "Climb peaks and enjoy the PNW in all it's glory",
  			"longDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
  $.getJSON(TRIPS_SEARCH_URL, callback);
}

function displayTripsHTML(trip) {
  return `
  <p class='trip-name'>${trip.name}</p>
  <p>${trip.location.state}</p>
  `
}



let trips = {}

function displayTrips(data) {
  const results = data.trips.map((trip) => displayTripsHTML(trip));
  
  $('.recent-trips').append(results);
  trips = data;
  console.log(trips);

}

function displayComments(comment) {
  return `<p class="comments" hidden>${comment.content}</p>`
}

function handleClickForComments(data) {
  $('body').on('click', '.show-comments', function(data) {
    $('.comments').prop('hidden', false);
    $('.show-comments').replaceWith(`<button type="click" class="hide-comments">Hide Comments</button>`);
  });
}

function handleClickToHideComments() {
  $('body').on('click', '.hide-comments', function(event) {
    event.preventDefault();
    $('.comments').prop('hidden', true);
    $('.hide-comments').replaceWith(`<button class="show-comments" type='click'>Show Comments</button>`);
    console.log('hiding comments');
  })
}

function getAndDisplayTrips() {
  getTrips(displayTrips);
}



//Showing search results for id

function getTripById(tripId, callback) {
  $.getJSON(`${TRIPS_SEARCH_URL}/${tripId}`, displayTripById)
}

function displayTripById(data) {
  console.log(data);
  $('.recent-trips').prop('hidden', true);
  $('.search-results').prop('hidden', false)  
  $('.search-results').append(`
    <p>${data.name}</p>
    <p>${data.shortDescription}</p>
    <p>${data.longDescription}</p>
    <p>Difficulty rating: ${data.difficulty}</p>
    `)
}

function handleSubmitSearchData() {
  $('.submit-search-data').on('click', function(event) {
    event.preventDefault();
    const tripId = $("input[id='tripId']").val();
    console.log('test');
    console.log(tripId);
    getTripById(tripId);
  })
}

function displayTripDetails(selectedTripName) {
    function matchName(obj) {
      return obj.name === selectedTripName;
    }
    let selectedTrip = trips.trips.find(matchName);
    const comments = selectedTrip.comments.map(comment => displayComments(comment)).join('');
    
    console.log(selectedTrip);
    $('.recent-trips').prop('hidden', true);
    $('.trip-details').prop('hidden', false);
    console.log(`${selectedTrip.id}`)
    $('.trip-details').html(`
          <h2>Check Out these Trips</h2>
          <div class=tripId hidden></div>
          <h3 data-tripId=${selectedTrip.id}>${selectedTrip.name}</h3>
          <p>${selectedTrip.shortDescription}</p>
          <p>${selectedTrip.longDescription}</p>
          <p>Contributed by: ${selectedTrip.contributedBy}</p>
          <p>${selectedTrip.location.longAndLat}</p>
          <p>${selectedTrip.nights} night(s)</p>
          <p>${selectedTrip.totalMiles} miles</p>
          <p>Features: ${selectedTrip.features}</p>
        <h2 class="comments" hidden>Comments</h2>  
          <p class="comments" hidden>${comments}</p>
      <button class="delete-trip" type='click'>Delete this Trip</button><br>
      <button class="edit-trip" type='click'>Edit this Trip</button><br>
      <button class="show-comments" type='click'>Show Comments</button>
      `);
}

function handleClickForTripDetails() {
  $('.recent-trips').on('click', '.trip-name', function() {
    console.log('click click');
    let selectedTripName = $(this).text()
    console.log(selectedTripName);
    displayTripDetails(selectedTripName);

  })
}

//Searching trips
function handleSearchTripsButton() {
  $('.search-trips').on('click', function() {
    $('form').prop('hidden', false);
  })
}

//    Get users

function getUsers(callback) {
  // setTimeout(function(){ callback(MOCK_USERS)}, 100);
  $.getJSON(USERS_SEARCH_URL, callback)
}

function displayUsersHTML(user) {
  return `
  <p>${user.firstName} ${user.lastName}</p>
  `
}

function displayUsers(data) {
  const results = data.users.map((user) => displayUsersHTML(user));
  $('.recent-trips').prop('hidden', true);
  $('.users').prop('hidden', false);
  $('.users').append(results);
}

function getAndDisplayUsers() {
  getUsers(displayUsers);
}

function handleClickViewUsers() {
  $('.view-users').on('click', function() {
    getAndDisplayUsers();
  })
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


//Posting a trip
function handlesPostATripButton() {
  $('.post-trip-button').on('click', function() {
    $('.recent-trips').prop('hidden', true);
    $('.post-trip').prop('hidden', false);
  })
}

function displayPostedTrip() {
  console.log(data);
}

function postTrip(name, state, longAndLat, nights, shortDescription, longDescription, difficulty, features, userContributed, callback) {
  const settings = {
    url: TRIPS_SEARCH_URL,
    data: {
      "name": `${name}`,
      "state": `${state}`,
      "longAndLat": `${longAndLat}`,
      "nights": `${nights}`,
      "shortDescription": `${shortDescription}`,
      "longDescription": `${longDescription}`,
      "difficulty": `${difficulty}`,
      "features": `${features}`,
      "userContributed": `${userContributed}`
    },
  dataType:'json',
  type: 'POST',
  success: callback,
  contentType: 'JSON'
}
 console.log(settings);
  $.ajax(settings);
}

function handlesPostingNewTrip() {
  $('.submit-trip').on('click', function(event) {
    event.preventDefault();
    const name = $(".trip-posting-form input[id='name']").val();
    const state = $(".trip-posting-form select[id='state']").val();
    const longAndLat = $(".trip-posting-form input[id='long-and-lat']").val();
    const nights = $(".trip-posting-form input[id='nights']").val();
    const shortDescription = $(".trip-posting-form input[id='short-description']").val();
    const longDescription = $(".trip-posting-form input[id='long-description']").val();
    const difficulty = $(".trip-posting-form select[id='difficulty']").val();
    const features = $(".trip-posting-form input[id='features']").val();
    const userContributed = $(".trip-posting-form input[id='user-contributed']").val();
    const tripDate = [name, state, longAndLat, nights, shortDescription, longDescription, difficulty, features]
    postTrip(name, state, longAndLat, nights, shortDescription, longDescription, difficulty, features, userContributed, displayPostedTrip);
  })
}

//Editing a trip

function updateTripDetails() {
  $('.trip-editing-view').prop('hidden', false);
}

function handleClickToEdit() {
  $('.trip-details').on('click', '.edit-trip', function() {
    updateTripDetails();
  })
}

function putTripEdits(name, callback) {
  const settings = {
    url: TRIPS_SEARCH_URL + '/5b9dae9a1ce0a2565157bd7d',
    data: {"name": `${name}`},
    dataType: 'json',
    method: 'GET',
    // contentType: 'application/json',
    success: callback
  }
  $.ajax(settings);
}

function displayUpdatedTripDetails() {
  $('.trip-editing-form').replaceWith('success!?')
}

function submitPutUpdates() {
  $('.submit-trip-edits').on('click', function(event) {
    event.preventDefault();
    console.log('heard submit data');
    const name = $(".trip-editing-form input[id='name']").val();
    console.log(name);
    putTripEdits(name, displayUpdatedTripDetails);
  })
}



// DELETE a trip

function deleteTrip(tripId, callback) {
  const settings = {
    url: TRIPS_SEARCH_URL + '/' + `${tripId}`,
    data: {id: `${tripId}`},
    dataType: 'json',
    type: 'DELETE',
    success: callback
  }
  $.ajax(settings)
}

function displayDeleteSuccess() {
  $('.trip-details').html('trip has been deleted')
}

function handlesClickToDeleteTrip() {
  $('.trip-details').on('click', '.delete-trip', function() {
    // const tripId = $('.trip-details h3').data('tripId');
    // const tripId = $('.tripId').html();
    const tripId = "5b9dae9a1ce0a2565157bd7d";
    console.log(tripId);
    deleteTrip(tripId, displayDeleteSuccess);
  })
}




// Become a user
function handleClickBecomeUser() {
  $('.post-user-button').on('click', function() {
    $('.recent-trips').prop('hidden', true);
    $('.register-as-user').prop('hidden', false)
  })
}

function postNewUser(userName, firstName, lastName, password, callback) {
  const settings = {
    url: USERS_SEARCH_URL,
    data: {
      userName:`${userName}`,
      firstName:`${firstName}`,
      lastName:`${lastName}`,
      password:`${password}`,
    },
    dataType: 'json',
    method:'POST',
    success: callback,
  }
  $.ajax(settings);
  console.log(settings.data)
}

function successMessage() {
  $('.register-as-user').html('registration success');
}

function handleSubmitUserInfo() {
  $('.submit-user-info').on('click', function(event) {
    event.preventDefault();
    console.log('heard become a user')
    const userName = $(".register-as-user input[id='userName']").val();
    const firstName = $(".register-as-user input[id='firstName']").val();
    const lastName = $(".register-as-user input[id='lastName']").val();
    const password = $(".register-as-user input[id='password']").val();
    postNewUser(userName, firstName, lastName, password, successMessage);
  })
}

//



function init () {
  $(handleClickToEdit);
  $(handlesClickToDeleteTrip);
  $(handleSubmitUserInfo);
  $(handleClickBecomeUser);
  
  $(handleSubmitSearchData);
  $(getAndDisplayProfile);
  $(getAndDisplayTrips);
  $(handleClickViewUsers);
  $(handleClickForComments);
  $(handleClickToHideComments);
  $(handleClickForTripDetails);
  $(handleSearchTripsButton);
  $(handlesPostingNewTrip);
  $(handlesPostATripButton);
  $(submitPutUpdates);
}

$(init)








