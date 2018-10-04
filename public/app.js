"use strict"

const TRIPS_SEARCH_URL = '/trips';
const USERS_SEARCH_URL = '/users';
const USER_LOGIN= '/auth/login';

// Make sure DOM elements are not visable
function hideOtherDomElements() {
  $('.recent-trips').prop('hidden', true);
  $('.trip-details').prop('hidden', true);
  $('.trip-editing-view').prop('hidden', true);
  $('.search-results').prop('hidden', true);
  $('.post-trip').prop('hidden', true);
  $('.users').prop('hidden', true);
  $('.user-profile').prop('hidden', true);
  $('.search').prop('hidden', true);
  $('.trip').prop('hidden', true);
  $('.no-results').prop('hidden', true);
}

// Check to see if user is logged in
function checkLoginStatus() {
  if(sessionStorage.getItem("token")) {
    $('.logged-in').prop('hidden', false);
    const username = sessionStorage.getItem('username');
    $('.logged-in').html(`You are logged in as ${username}`);
    $('.login').prop('hidden', true);
    $('.register').prop('hidden', true);
    $('.register-below').prop('hidden', true);
    $('.log-out').prop('hidden', false);
  } else {
    $('.logged-in').html('You are not logged in')
  }
}

// Get Trips
function getTrips(callback) {
  const settings = {
    url: TRIPS_SEARCH_URL,
    method: "GET",
    success: callback,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
    }
  }
  $.ajax(settings);
}

function displayTripsHTML(trip) {
  const shortenedDate = trip.dateAdded.slice(0,10);
  return `
  <div class='trip' data-trip-id=${trip.id}>
    <h3  class='trip-name'>${trip.name}</h3>
    <p>Short Description: ${trip.shortDescription}</p>
    <p>Contributed By: ${trip.userContributed.username}</p>
    <p>Date Added: ${shortenedDate}</p>
  <div>
  `
}

function displayTrips(data) {
  const results = data.trips.map((trip) => displayTripsHTML(trip));
  $('.recent-trips-results').html(results);
}

function getAndDisplayTrips() {
  getTrips(displayTrips);
}

function handleClickBrowseRecent() {
  $('.browse-recent').on('click', function(){
    hideOtherDomElements();
    getAndDisplayTrips();
    $('.recent-trips').prop('hidden', false);
  })
}

//Show search results for trip by id
function getTripById(selectedTripId, callback) {
  $.getJSON(`${TRIPS_SEARCH_URL}/${selectedTripId}`, callback)
}

function displayTripDetails(data) {
  hideOtherDomElements();
  $('.recent-trips').prop('hidden', true);
  $('.trip-details').prop('hidden', false);
  $('.trip-details').html(`
        <h3 data-trip-id=${data.id}>${data.name}</h3>
        <p>Quick Description: ${data.shortDescription}</p>
        <p>Contributed by: ${data.userContributed.username}</p>
        <p>Exact Trailhead location: ${data.location.longAndLat}</p>
        <p>State: ${data.location.state}</p>
        <p>Number of Nights: ${data.nights} night(s)</p>
        <p>Total Mileage: ${data.totalMileage} miles</p>
        <p>Difficulty Rating: ${data.difficulty}</p>
        <p class="long-description">Detailed Description: ${data.longDescription}</p>
    `);
  if (data.userContributed._id === sessionStorage.getItem("userId")) {
    $('.trip-details').append(`
      <p class='make-changes'>You are the author of this trip. You can make changes by selecting below</p>
      <button class="delete-trip" type='click'>Delete this Trip</button><br>
      <button class="edit-trip" type='click'>Edit this Trip</button><br>
      `)
    }
}

function handleClickForTripDetails() {
  $('body').on('click', '.trip', function() {
    let selectedTripId = $(this).data('trip-id');
    $('.search-results').prop('hidden', true);
    getTripById(selectedTripId, displayTripDetails);
  })
}

//Search trips
function clearSearchForm() {
  $('.search-trips-form div input').val('');
  $('.search-trips-form select').val('');
  $('.search-trips-form textarea').val('');
}

function handleSearchTripsButton() {
  $('.search-trips').on('click', function() {
    hideOtherDomElements();
    $('.search').prop('hidden', false);
  })
}

function displaySearchResults(data) {
  hideOtherDomElements();
  $('.search-results').prop('hidden', false )
  let results = '<p class="no-results">No results matching your search</p>'
  if (data.trips.length>0) {
    results = data.trips.map((trip) => displayTripsHTML(trip));
  }
  $('.search-results').html(results);
}

function getSearchedTrips(tripData, callback) {
  const query = {
    name: tripData.name,
    "location.state": tripData.state,
    minNights: tripData.minNights,
    maxNights: tripData.maxNights,
    minMileage: tripData.minMileage,
    maxMileage: tripData.maxMileage,
    difficulty: tripData.difficulty,
    description: tripData.description,
  }
  $.getJSON(TRIPS_SEARCH_URL, query, callback);
}

function submitSearchParams() {
  $('form.search-trips-form').on('submit', function(event) {
    event.preventDefault();
    // Only pass through search parameters if user inputs a value
    let name = $(".search-trips-form input[id='search-name']").val();
    if (name.length < 1) {name = undefined}
    let state = $(".search-trips-form select[id='search-state']").val();
    if (state.length < 1) {state = undefined}
    let minNights = $(".search-trips-form input[id='search-minNights']").val();
    if (minNights.length < 1) {minNights = undefined}
    let maxNights = $(".search-trips-form input[id='search-maxNights']").val();
    if (maxNights.length < 1) {maxNights = undefined}
    let minMileage = $(".search-trips-form input[id='search-minMileage']").val();
    if (minMileage.length < 1) {minMileage = undefined}
    let maxMileage = $(".search-trips-form input[id='search-maxMileage']").val();
    if (maxMileage.length < 1) {maxMileage = undefined}
    let description = $(".search-trips-form input[id='search-description']").val();
    if (description.length < 1) {description = undefined}
    let difficulty = $(".search-trips-form select[id='search-difficulty']").val();
    if (difficulty.length < 1) {difficulty = undefined}    
    const tripData = {minMileage, maxMileage, name, state, minNights, maxNights, description, difficulty}
    getSearchedTrips(tripData, displaySearchResults);
    clearSearchForm();
  })
}  

// Add slide effect on search form
function showHideSearchField() {
  $('.search-trips-form h3').on('click', function() {
    $(this.nextElementSibling).slideToggle();
  })
}

//Get one user profile
function getUserById(userId, callback) {
  const settings = {
    url: `${USERS_SEARCH_URL}/${userId}`,
    data: JSON.stringify({"id": `${userId}`}),
    method: 'GET',
    dataType: 'json',
    success: callback
  }
  $.ajax(settings);
}

function translateTripId(tripId) {
  for(let i=0; i<MOCK_TRIPS.trips.length; i++) {
    if(MOCK_TRIPS.trips[i].id === tripId.id) {
      return `<p>${MOCK_TRIPS.trips[i].name}</p>`
    }
  }
}  

// Post a trip
function clearPostingForm() {
  $('.trip-posting-form div input').val('');
  $('.trip-posting-form select').val('');
  $('.trip-posting-form textarea').val('');
}

function handlesPostATripButton() {
  $('.post-trip-button').on('click', function() {
    if (!sessionStorage.getItem("token")) {
      alert('You must be logged in in order to post a trip');
    } else {
    hideOtherDomElements();  
    $('.name-taken').prop('hidden', true);
    $('.post-trip').prop('hidden', false);
    clearPostingForm();
  }})
}

function displayPostedTrip(data) {
  getTripById(data.id, displayTripDetails);
}

function postTrip(tripData, callback) {
  const _data = {
      "name": `${tripData.name}`,
      "location": {"longAndLat": `${tripData.longAndLat}`,"state": `${tripData.state}`},
      "nights": `${tripData.nights}`,
      "shortDescription": `${tripData.shortDescription}`,
      "longDescription": `${tripData.longDescription}`,
      "difficulty": `${tripData.difficulty}`,
      "userContributed": `${tripData.userContributed}`,
      "totalMileage": `${tripData.totalMileage}`,
      "dateAdded": Date.now()
    }
  const settings = {
    url: TRIPS_SEARCH_URL,
    data: JSON.stringify(_data),
    dataType:"json",
    type: 'POST',
    success: callback,
    contentType: "application/json",
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("token"));
    }
}
  $.ajax(settings)
    .fail(function(xhr, status, error) {
        alert(`${xhr.responseJSON.message}`)
    });
}

function handlesPostingNewTrip() {
  $('.trip-posting-form').on('submit', function(event) {
    event.preventDefault();
    const name = $(".trip-posting-form input[id='post-name']").val();
    const state = $(".trip-posting-form select[id='post-state']").val();
    const longAndLat = $(".trip-posting-form input[id='post-long-and-lat']").val();
    const nights = $(".trip-posting-form input[id='post-nights']").val();
    const totalMileage = $(".trip-posting-form input[id='post-total-mileage']").val();
    const shortDescription = $(".trip-posting-form input[id='post-short-description']").val();
    const longDescription = $(".trip-posting-form textarea").val();
    const difficulty = $(".trip-posting-form select[id='post-difficulty']").val();    
    const userContributed = sessionStorage.getItem("userId");
    const now = new Date();
    const dateAdded = (`${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`)
    const tripData = {dateAdded, userContributed, totalMileage, name, state, longAndLat, nights, shortDescription, longDescription, difficulty}
    postTrip(tripData, displayPostedTrip);
    $('.post-trip').prop('hidden', true);
    clearPostingForm();
  })
}

// Add functionality when filling out form to alert user if trip name is already taken
function focusOutOfName() {
  $(".trip-posting-form input[id='post-name']").on('focusout', function(){
    const inputName = $(".trip-posting-form input[id='post-name']").val();
    checkIfNameIsTaken(inputName, checkName)
  })
}

function checkIfNameIsTaken(inputName, callback) {
    const query = {
      "name": inputName
     }
     $.getJSON(TRIPS_SEARCH_URL, query, callback);
   }

function checkName(data) {
  if (data.trips.length>0) {
    $('.name-taken').html('Sorry, There is already a trip by that name. Please choose a different one')
    $('.name-taken').prop('hidden', false);
    $('#submit-trip').attr('disabled', true);
  } else {
    $('.name-taken').prop('hidden', true);
    $('#submit-trip').attr('disabled', false);
  }
}

//Edit a trip
function clearEditForm() {
  $('.trip-editing-form div input').val('');
  $('.trip-editing-form select').val('');
  $('.trip-editing-form textarea').val('');
}

function updateTripDetails() {
  clearEditForm();
  $('.trip-editing-view').prop('hidden', false);
  $("html, body").animate({ scrollTop: $('.trip-editing-view').offset().top }, 1000);
}

function handleClickToEdit() {
  $('.trip-details').on('click', '.edit-trip', function() {
    updateTripDetails();
  })
}

function putTripEdits(tripId, keyValuesToBeUpdated, callback) {
  const _data = keyValuesToBeUpdated;
  const settings = {
    url: TRIPS_SEARCH_URL+'/'+`${tripId}`,
    data: JSON.stringify(_data),
    dataType: 'json',
    method: 'PUT',
    contentType: 'application/json',
    success: callback
  }
  $.ajax(settings);
}

function displayUpdatedTripDetails(data) {
  $('.trip-editing-view').prop('hidden', true);
  getTripById(data.id, displayTripDetails);
}

function submitTripUpdates() {
  $('.submit-trip-edits').on('click', function(event) {
    event.preventDefault();
    const tripId = $('.trip-details h3').data('trip-id');
    const _name = $(".trip-editing-form input[id='edit-name']").val();
    const _state = $(".trip-editing-form select[id='edit-state']").val();
    const _longAndLat = $(".trip-editing-form input[id='edit-long-and-lat']").val();
    const _nights = $(".trip-editing-form input[id='edit-nights']").val();
    const _totalMileage = $(".trip-editing-form input[id='edit-total-mileage']").val();
    const _shortDescription = $(".trip-editing-form input[id='edit-short-description']").val();
    const _longDescription = $(".trip-editing-form textarea[id='edit-long-description']").val();
    const _difficulty = $(".trip-editing-form select[id='edit-difficulty']").val();
    const _userContributed = sessionStorage.getItem("userId");
    const keyValuesToBeUpdated = {
      "id": `${tripId}`
    }
    // Only pass along update info of info contributed by user
    const updateableData = [{userContributed: _userContributed}, {name: _name}, {state: _state}, {longAndLat: _longAndLat}, {nights: _nights}, {totalMileage: _totalMileage}, {shortDescription: _shortDescription}, {longDescription: _longDescription}, {difficulty: _difficulty} ]
    updateableData.forEach(keyValue => {
      if (!(Object.values(keyValue)[0] === "") && !(Object.values(keyValue)[0] === null)) {
        keyValuesToBeUpdated[Object.keys(keyValue)] = Object.values(keyValue)[0];
      }
    });
    putTripEdits(tripId, keyValuesToBeUpdated, displayUpdatedTripDetails);
    clearEditForm();
  })
}

// Alert user if updating a name to a name already taken
function focusOutOfNameEdit() {
  $(".trip-editing-form input[id='edit-name']").on('focusout', function(){
    const inputName = $(".trip-editing-form input[id='edit-name']").val();
    checkIfNameIsTaken(inputName, checkNameEdit)
  })
}

function checkNameEdit(data) {
  if (data.trips.length>0) {
    $('.edit-name-taken').html('Sorry, There is already a trip by that name. Please choose a different one')
    $('.edit-name-taken').prop('hidden', false);
    $('#submit-trip-edits').attr('disabled', true);
  } else {
    $('.edit-name-taken').prop('hidden', true);
    $('#submit-trip-edits').attr('disabled', false);
  }
}

// DELETE a trip by id if user is the original contributer
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
  hideOtherDomElements();
  $('.trip-details').prop('hidden', false);
  $('.trip-details').html('<p class="deleted">Your trip has been deleted</p>')
}

function handlesClickToDeleteTrip() {
  $('.trip-details').on('click', '.delete-trip', function() {
    const tripId = $('.trip-details h3').data('trip-id');
    deleteTrip(tripId, displayDeleteSuccess);
  })
}

// Become a new user
function handleClickBecomeUser() {
  $('.register').on('click', function() {
    $('.login-status > *').prop('hidden', true)
    $('.register-as-user').prop('hidden', false);
  })
}

function postNewUser(userData, callback) {
  const _data = {
      username:`${userData.username}`,
      firstName:`${userData.firstName}`,
      lastName:`${userData.lastName}`,
      password:`${userData.password}`,
    }
  const settings = {
    url: USERS_SEARCH_URL,
    data: JSON.stringify(_data) ,
    dataType: 'json',
    method:'POST',
    success: callback,
    contentType: 'application/json'
  }
  $.ajax(settings)
    .fail(function(xhr, status, error) {
        alert(`${xhr.responseJSON.location} ${xhr.responseJSON.message}`)
    });
}

function displayUserProfile(data) {
  $('.users').prop('hidden', true);
  $('.user-profile').prop('hidden', false)
  $('.user-profile').append(`
    <div class="profile">
      <h2>Thanks for registering with us ${data.firstName} ${data.lastName}!</h2>
      <h2>You can now login as a user.<h2>
      <p>Your Username:</p>
      <p>${data.username}</p>
    </div>
    `);
}

function displayNewUser(res) {
  $('.recent-trips').prop('hidden', true);
  $('.login-area').prop('hidden', false);
  $('.register-as-user').prop('hidden', true);
  const userId = res.id;
  const username = res.username;
  getUserById(userId, displayUserProfile);
}

function handleSubmitUserInfo() {
  $('.user-registration').on('submit', function(event) {
    event.preventDefault();
    const username = $(".register-as-user input[id='username']").val();
    const firstName = $(".register-as-user input[id='firstName']").val();
    const lastName = $(".register-as-user input[id='lastName']").val();
    const password = $(".register-as-user input[id='password']").val();
    const userData = {username, firstName, lastName, password}
    postNewUser(userData, displayNewUser);
  })
}

// Add login functionality
function verifyUser(loginData, callback) {
  const _loginData = {
      username:`${loginData.username}`,
      password:`${loginData.password}`
    } 
  const settings = {
    url:USER_LOGIN,
    data: JSON.stringify(_loginData) ,
    dataType: 'json',
    method: 'POST',
    contentType: 'application/json',
    success: callback
  }
  $.ajax(settings)
  .fail(function(xhr, status, error) {
        alert(`Username and/or Password not valid`)
    });
}

// Store user info in session storage
function storeUserInfo(res) {
  if (res) {
    $('.login-area').prop('hidden', true);
    $('.log-out').prop('hidden', false);
  }  
  sessionStorage.setItem("token", `${res.authToken}`);
  sessionStorage.setItem("userId", `${res.userId}`);
  sessionStorage.setItem("username", `${res.username}`);
  checkLoginStatus();
}

function handleClickLogin() {
  $('.login').on('click', function() {
    $('.login').prop('hidden', true);
    $('.login-area').prop('hidden', false);
  })
}

function userlogin() {
  $('.login-form').on('submit', function(event) {
    event.preventDefault();
    const username = $(".login-form input[id='login-username']").val();
    const password = $(".login-form input[id='login-password']").val();
    const loginData = {username, password};
    verifyUser(loginData, storeUserInfo);
  })
}

// User logout
function handlesLogOutClick() {
  $('.log-out').on('click', function() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    checkLoginStatus();
    $('.login').prop('hidden', false);
    $('.register').prop('hidden', false);
    $('.register-below').prop('hidden', false);
    $('.log-out').prop('hidden', true);
  })
}

function init () {
  $(focusOutOfNameEdit);
  $(focusOutOfName);
  $(showHideSearchField);
  $(handleClickBrowseRecent)
  $(submitSearchParams);
  $(handlesLogOutClick);
  $(checkLoginStatus);
  $(handleClickToEdit);
  $(handlesClickToDeleteTrip);
  $(handleSubmitUserInfo);
  $(handleClickBecomeUser);
  $(getAndDisplayTrips);
  $(handleClickForTripDetails);
  $(handleSearchTripsButton);
  $(handlesPostingNewTrip);
  $(handlesPostATripButton);
  $(submitTripUpdates);
  $(handleClickLogin);
  $(userlogin);
}

$(init)








