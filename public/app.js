"use strict"


//FOR DEPLOYMENT ON HEROKU

const TRIPS_SEARCH_URL = '/trips';
const USERS_SEARCH_URL = '/users';
const USER_LOGIN= '/auth/login';

//FOR LOCAL DEV ON LOCAL SERVER
// const TRIPS_SEARCH_URL = 'http://localhost:8080/trips';
// const USERS_SEARCH_URL = 'http://localhost:8080/users';
// const USER_LOGIN= 'http://localhost:8080/auth/login'; 


//making sure DOM elements are not visable

function hideOtherDomElements() {
  $('.recent-trips').prop('hidden', true);
  $('.trip-details').prop('hidden', true);
  $('.trip-editing-view').prop('hidden', true);
  $('.search-results').prop('hidden', true);
  $('.post-trip').prop('hidden', true);
  $('.users').prop('hidden', true);
  $('.user-profile').prop('hidden', true);
  $('.search-trips-form').prop('hidden', true);
}


//Check to see if logged in

function checkLoginStatus() {
  if(sessionStorage.getItem("token")) {
    $('.logged-in').prop('hidden', false);
    $('.logged-in').html('You are logged in as _getuser');
    $('.login').prop('hidden', true);
    $('.register').prop('hidden', true);
    $('.register-below').prop('hidden', true);
    $('.log-out').prop('hidden', false);
  } else {
    $('.logged-in').html('You are not logged in')
  }
}

//    Getting Trips and comments

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
    <h4  class='trip-name'>${trip.name}</h4>
    <p>Short Description: ${trip.shortDescription}</p>
    <p>Contributed By:${trip.userContributed.username}</p>
    <p>Date Added:${shortenedDate}</p>
  <div>
  `
}

function displayTrips(data) {
  const results = data.trips.map((trip) => displayTripsHTML(trip));
  $('.recent-trips').append(results);
  // trips = data;
}

function getAndDisplayTrips() {
  getTrips(displayTrips);
}
// function displayComments(comment) {
//   return `<p class="comments" hidden>${comment.content}</p>`
// }
// function handleClickForComments(data) {
//   $('body').on('click', '.show-comments', function(data) {
//     $('.comments').prop('hidden', false);
//     $('.show-comments').replaceWith(`<button type="click" class="hide-comments">Hide Comments</button>`);
//   });
// }
// function handleClickToHideComments() {
//   $('body').on('click', '.hide-comments', function(event) {
//     event.preventDefault();
//     $('.comments').prop('hidden', true);
//     $('.hide-comments').replaceWith(`<button class="show-comments" type='click'>Show Comments</button>`);
//   })
// }

function handleClickBrowseRecent() {
  $('.browse-recent').on('click', function(){
    hideOtherDomElements();
    $('.recent-trips').prop('hidden', false);
  })
}

//Showing search results for trip by id

function getTripById(selectedTripId, callback) {
  $.getJSON(`${TRIPS_SEARCH_URL}/${selectedTripId}`, callback)
}

function displayTripDetails(data) {
    // const comments = selectedTrip.comments.map(comment => displayComments(comment)).join('');
    hideOtherDomElements();
    $('.recent-trips').prop('hidden', true);
    $('.trip-details').prop('hidden', false);
    $('.trip-details').html(`
          <h2>Check Out these Trips</h2>
          <div class=tripId hidden></div>
          <h3 data-trip-id=${data.id}>${data.name}</h3>
          <p>Quick Description: ${data.shortDescription}</p>
          <p>Detailed Description${data.longDescription}</p>
          <p>Contributed by: ${data.userContributed.username}</p>
          <p>Exact Trailhead location: ${data.location.longAndLat}</p>
          <p>State: ${data.location.state}</p>
          <p>Number of Nights: ${data.nights} night(s)</p>
          <p>Total Mileage: ${data.totalMileage} miles</p>
          <p>Difficulty Rating: ${data.difficulty}</p>
      `);
    if (data.userContributed._id === sessionStorage.getItem("userId")) {
      $('.trip-details').append(`
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

//Searching trips
function handleSearchTripsButton() {
  $('.search-trips').on('click', function() {
    hideOtherDomElements();
    // $('.recent-trips').prop('hidden', true);
    $('.search-trips-form').prop('hidden', false);

    // $('.search-trips').prop('hidden', true);
  })
}

function displaySearchResults(data) {
  $('.search-trips-form').prop('hidden', true);
  $('.search-results').prop('hidden', false )
  let results = '<p>No results. Try again</p>'
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
    console.log('heard')
    let name = $(".search-trips-form input[id='name']").val();
    if (name.length < 1) {name = undefined}
    let state = $(".search-trips-form select[id='state']").val();
    if (state.length < 1) {state = undefined}
    let minNights = $(".search-trips-form input[id='minNights']").val();
    if (minNights.length < 1) {minNights = undefined}
    let maxNights = $(".search-trips-form input[id='maxNights']").val();
    if (maxNights.length < 1) {maxNights = undefined}
    let minMileage = $(".search-trips-form input[id='minMileage']").val();
    if (minMileage.length < 1) {minMileage = undefined}
    let maxMileage = $(".search-trips-form input[id='maxMileage']").val();
    if (maxMileage.length < 1) {maxMileage = undefined}
    let description = $(".search-trips-form input[id='description']").val();
    if (description.length < 1) {description = undefined}
    let difficulty = $(".search-trips-form select[id='difficulty']").val();
    if (difficulty.length < 1) {difficulty = undefined}    
    const tripData = {minMileage, maxMileage, name, state, minNights, maxNights, description, difficulty}
    getSearchedTrips(tripData, displaySearchResults);

  })
}  

//Get users

function getUsers(callback) {
  // setTimeout(function(){ callback(MOCK_USERS)}, 100);
  $.getJSON(USERS_SEARCH_URL, callback)
}

function displayUsersHTML(user) {
  return `
  <p data-user-id=${user.id}>${user.firstName} ${user.lastName}</p>
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

function getUserById(userId, callback) {
  // setTimeout(function(){ callback(MOCK_USERS)}, 100);
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

function displayUserProfile(data) {
  // const idOfTripsPosted = data.users[0].tripsPosted;
  // const tripsNamesPosted = idOfTripsPosted.map(tripId => translateTripId(tripId)).join('');
  $('.users').prop('hidden', true);
  $('.user-profile').prop('hidden', false)
  $('.user-profile').append(`
    <p>${data.username}</p>
    <p>${data.firstName} ${data.lastName}</p>
    <p>Trips Posted: ${data.tripsPosted}</p>
    `);
}

function getAndDisplayProfile() {
  $('.users').on ('click', 'p', function() {
    const userId = $(this).data('user-id');
    console.log(userId);
    getUserById(userId, displayUserProfile);
  }) 
}

//Posting a trip

function handlesPostATripButton() {
  $('.post-trip-button').on('click', function() {
    if (!sessionStorage.getItem("token")) {
      alert('You must be logged in in order to post a trip');
    } else {
    hideOtherDomElements();  
    // $('.recent-trips').prop('hidden', true);
    $('.post-trip').prop('hidden', false);
    // $('.trip-details').prop('hidden', true);
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
      // "features": `${tripData.features}`,
      "userContributed": `${tripData.userContributed}`,
      "totalMileage": `${tripData.totalMileage}`,
      "dateAdded": Date.now()
    }
    console.log(_data.dateAdded)
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
  $.ajax(settings);
}

function handlesPostingNewTrip() {
  $('.trip-posting-form').on('submit', function(event) {
    event.preventDefault();
    const name = $(".trip-posting-form input[id='name']").val();
    const state = $(".trip-posting-form select[id='state']").val();
    const longAndLat = $(".trip-posting-form input[id='long-and-lat']").val();
    const nights = $(".trip-posting-form input[id='nights']").val();
    const totalMileage = $(".trip-posting-form input[id='total-mileage']").val();
    const shortDescription = $(".trip-posting-form input[id='short-description']").val();
    const longDescription = $(".trip-posting-form input[id='long-description']").val();
    const difficulty = $(".trip-posting-form select[id='difficulty']").val();
    // const features = [];
    //   $(".trip-posting-form input:checkbox[id='features']:checked").each(function() {
    //     features.push($(this).val());  
    //   });     
    const userContributed = sessionStorage.getItem("userId");
    const now = new Date();
    const dateAdded = (`${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`)
    const tripData = {dateAdded, userContributed, totalMileage, name, state, longAndLat, nights, shortDescription, longDescription, difficulty}
    console.log(tripData)
    postTrip(tripData, displayPostedTrip);
    $('.post-trip').prop('hidden', true);
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
  console.log('trip updated');
  $('.trip-editing-view').prop('hidden', true);
  getTripById(data.id, displayTripDetails);
}

function submitTripUpdates() {
  $('.submit-trip-edits').on('click', function(event) {
    event.preventDefault();
    const tripId = $('.trip-details h3').data('trip-id');
    const _name = $(".trip-editing-form input[id='name']").val();
    const _state = $(".trip-editing-form select[id='state']").val();
    const _longAndLat = $(".trip-editing-form input[id='long-and-lat']").val();
    const _nights = $(".trip-editing-form input[id='nights']").val();
    const _totalMileage = $(".trip-editing-form input[id='total-mileage']").val();
    const _shortDescription = $(".trip-editing-form input[id='short-description']").val();
    const _longDescription = $(".trip-editing-form input[id='long-description']").val();
    const _difficulty = $(".trip-editing-form select[id='difficulty']").val();
    // const _features = [];
    //   $(".trip-editing-form input[id='features']").each(function() {
    //     if($(this).is(':checked')) {
    //       let checked = ($(this).val());
    //       features.push(checked);
    //     }
    //   });
    const _userContributed = sessionStorage.getItem("userId");
    // const now = new Date();
    const keyValuesToBeUpdated = {
      "id": `${tripId}`
    }

    const updateableData = [{userContributed: _userContributed}, {name: _name}, {state: _state}, {longAndLat: _longAndLat}, {nights: _nights}, {totalMileage: _totalMileage}, {shortDescription: _shortDescription}, {longDescription: _longDescription}, {difficulty: _difficulty} ]
    updateableData.forEach(keyValue => {
      if (!(Object.values(keyValue) == null)) {
        keyValuesToBeUpdated[Object.keys(keyValue)] = Object.values(keyValue)[0];
      }
    });
    putTripEdits(tripId, keyValuesToBeUpdated, displayUpdatedTripDetails);
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
        console.log(xhr);
        alert(`${xhr.responseJSON.location} ${xhr.responseJSON.message}`)
    });
}

function displayNewUser(res) {
  

  $('.recent-trips').prop('hidden', true);
  $('.login-area').prop('hidden', false);
  $('.register-as-user').prop('hidden', true);

  const userId = res.id;
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

//login in 

function verifyUser(loginData, callback) {
  const _loginData = {
      username:`${loginData.username}`,
      password:`${loginData.password}`
    }
  console.log(_loginData);  
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
        console.log(xhr);
        alert(`Username and/or Password not valid`)
    });

}

function storeUserInfo(res) {
  if (res) {
    $('.login-area').prop('hidden', true);
    $('.log-out').prop('hidden', false);
  }  

  sessionStorage.setItem("token", `${res.authToken}`);
  sessionStorage.setItem("userId", `${res.userId}`);
  checkLoginStatus();
  
}

function handleClickLogin() {
  $('.login').on('click', function() {
    // $('.login-status > *').prop('hidden', true)
    $('.login').prop('hidden', true);
    $('.login-area').prop('hidden', false);
  })
}

function userlogin() {
  $('.login-form').on('submit', function(event) {
    event.preventDefault();
    console.log('heard submit');
    const username = $(".login-form input[id='username']").val();
    const password = $(".login-form input[id='password']").val();
    const loginData = {username, password};
    verifyUser(loginData, storeUserInfo);

    // storeUserId(username)
  })
}

function handlesLogOutClick() {
  $('.log-out').on('click', function() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    console.log('heard');
    checkLoginStatus();
    $('.login').prop('hidden', false);
    $('.register').prop('hidden', false);
    $('.register-below').prop('hidden', false);
    $('.log-out').prop('hidden', true);

  })
}

function init () {
  $(handleClickBrowseRecent)
  $(submitSearchParams);
  $(handlesLogOutClick);
  $(checkLoginStatus);
  $(handleClickToEdit);
  $(handlesClickToDeleteTrip);
  $(handleSubmitUserInfo);
  $(handleClickBecomeUser);
  // $(handleSubmitSearchData);
  $(getAndDisplayProfile);
  $(getAndDisplayTrips);
  $(handleClickViewUsers);
  // $(handleClickForComments);
  // $(handleClickToHideComments);
  $(handleClickForTripDetails);
  $(handleSearchTripsButton);
  $(handlesPostingNewTrip);
  $(handlesPostATripButton);
  $(submitTripUpdates);
  $(handleClickLogin);
  $(userlogin);
}

$(init)








