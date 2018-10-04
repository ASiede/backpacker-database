"use strict";


const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Trip, User} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const seedTrips = require('../db/trips');
const seedUsers = require('../db/users');

chai.use(chaiHttp);

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const passport = require('passport');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

//Seeding trip data
function seedTripData() {
  console.info('seeding trip data');
  return Trip.insertMany(seedTrips);
}
//Seeding user data
function seedUserData() {
  console.info('seeding user data');
  return User.insertMany(seedUsers);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Trips API resource', function() {
  this.timeout(15000);

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedTripData();
  });

   beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

//POST endpoint for users
  // describe('POST endpoint', function() {

  //   it('should add a new user', function() {
  //     const userData = {"username": "JDoe", "password": "passwordpassword", "firsName": "John", "lastName": "Doe"}
  //     return chai.request(app)
  //       .post('/users')
  //       .send(userData)
  //       .then(function(res) {         
  //         expect(res).to.have.status(201);
        //   expect(res).to.be.json;
        //   expect(res.body).to.be.a('object');
        //   expect(res.body).to.include.keys(
        //     'id', 'name', 'location', 'nights', 'totalMileage', 'shortDescription', 'longDescription', 'features');
        //   expect(res.body.id).to.not.be.null;
        //   expect(res.body.name).to.equal(newTrip.name);
        //   expect(res.body.nights).to.equal(newTrip.nights);
        //   expect(res.body.totalMileage).to.equal(newTrip.totalMileage);
        //   expect(res.body.shortDescription).to.equal(newTrip.shortDescription);
        //   expect(res.body.longDescription).to.equal(newTrip.longDescription);
        //   expect(res.body.difficulty).to.equal(newTrip.difficulty);
        //   return Trip.findById(res.body.id);
        // })
        // .then(function(trip) {
        //   expect(trip.name).to.equal(newTrip.name);
        //   expect(trip.nights).to.equal(newTrip.nights);
        //   expect(trip.totalMileage).to.equal(newTrip.totalMileage);
        //   expect(trip.shortDescription).to.equal(newTrip.shortDescription);
        //   expect(trip.longDescription).to.equal(newTrip.longDescription);
        //   expect(trip.difficulty).to.equal(newTrip.difficulty);
        //   expect(trip.features).to.contain(newTrip.features);
        //   expect(trip.location.longAndLat).to.equal(newTrip.location.longAndLat);
        //   expect(trip.location.state).to.equal(newTrip.location.state);
      // });
  //   });
  // });

// GET endpoint for trips
  describe('GET endpoint', function() {

    it('should return all existing trips', function() {
      let res;
      return chai.request(app)
        .get('/trips')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.trips).to.have.lengthOf.at.least(1);
          return Trip.count();
        })
        .then(function(count) {
          expect(res.body.trips).to.have.lengthOf(count);
        });
    });

    it('should return trips with right fields', function() {
      let resTrip;
      return chai.request(app)
        .get('/trips')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.trips).to.be.a('array');
          expect(res.body.trips).to.have.lengthOf.at.least(1);
          res.body.trips.forEach(function(trip) {
            expect(trip).to.be.a('object');
            expect(trip).to.include.keys(
              'name', 'nights', 'id', 'location', 'totalMileage', 'shortDescription', 'longDescription', 'userContributed', 'difficulty');
          });
          resTrip = res.body.trips[0];
          return Trip.findById(resTrip.id);
        })
        .then(function(trip) {
          expect(resTrip.id).to.equal(trip.id);
          expect(resTrip.name).to.equal(trip.name);
          expect(resTrip.location).to.be.a('object');
          expect(resTrip.location.longAndLat).to.equal(trip.location.longAndLat);
          expect(resTrip.location.state).to.contain(trip.location.state);
          expect(resTrip.nights).to.equal(trip.nights);
          expect(resTrip.totalMileage).to.equal(trip.totalMileage);
          expect(resTrip.difficulty).to.equal(trip.difficulty);
          expect(resTrip.shortDescription).to.equal(trip.shortDescription);
          expect(resTrip.longDescription).to.equal(trip.longDescription);
        });
    });
  });

//POST endpoint for trips
  describe('POST endpoint', function() {

    it('should add a new trip', function() {
      //authorize user first
      const userData = {"username": "ehillory", "password": "everesteverest", "firsName": "Tenzing", "lastName": "Norgay"}
      return chai.request(app)
        .post('/users')
        .send(userData)
        .then(function(res) {          
          return chai.request(app)
            .get('/users')
            .then(function(res) {  
              return chai.request(app)
                .post('/auth/login')
                .send(userData)
                .then(function(res) {
                  return chai.request(app)
                  const newTrip = {
                    userContributed: `${res.body.userId}`,
                    name: "Super cool Trip",
                    location: {
                      "longAndLat": "45.5122° N, 122.6587° W",
                      "state": "CA"
                      },
                    nights: "3",
                    totalMileage: "9",
                    shortDescription: "Fun trip",
                    longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    difficulty: "easy",
                    features: ["wildflowers"]
                  }
                  .post('/trips')
                  .send(newTrip)
                  .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                      'id', 'name', 'location', 'nights', 'totalMileage', 'shortDescription', 'longDescription', 'features');
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.name).to.equal(newTrip.name);
                    expect(res.body.nights).to.equal(newTrip.nights);
                    expect(res.body.totalMileage).to.equal(newTrip.totalMileage);
                    expect(res.body.shortDescription).to.equal(newTrip.shortDescription);
                    expect(res.body.longDescription).to.equal(newTrip.longDescription);
                    expect(res.body.difficulty).to.equal(newTrip.difficulty);
                    return Trip.findById(res.body.id);
                  })
                  .then(function(trip) {
                    expect(trip.name).to.equal(newTrip.name);
                    expect(trip.nights).to.equal(newTrip.nights);
                    expect(trip.totalMileage).to.equal(newTrip.totalMileage);
                    expect(trip.shortDescription).to.equal(newTrip.shortDescription);
                    expect(trip.longDescription).to.equal(newTrip.longDescription);
                    expect(trip.difficulty).to.equal(newTrip.difficulty);
                    expect(trip.features).to.contain(newTrip.features);
                    expect(trip.location.longAndLat).to.equal(newTrip.location.longAndLat);
                    expect(trip.location.state).to.equal(newTrip.location.state);
              })
            })
          })
      });
    });
  });

//PUT endpoint for trips
  describe('PUT endpoint', function() {
    it('should update fields you send over', function() {
      const updateData = {
        name: 'Updated name',
        difficulty: 'really difficult'
      };
      return chai.request(app)
        .get('/trips')
        .then(function(res) {
          updateData.id = res.body.trips[0].id;
          return chai.request(app)
            .put(`/trips/${res.body.trips[0].id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          return Trip.findById(updateData.id);
        })
        .then(function(trip) {
          expect(trip.name).to.equal(updateData.name);
          expect(trip.difficulty).to.equal(updateData.difficulty);
        });
    });
  });   

//DELETE endpoint for trips
  describe('DELETE endpoint', function() {
    it('delete a trip by id', function() {
      let trip;
      return Trip
        .findOne()
        .then(function(_trip) {
          trip = _trip;
          return chai.request(app).delete(`/trips/${trip.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Trip.findById(trip.id);
        })
        .then(function(_trip) {
          expect(_trip).to.be.null;
        });
    });
  });
});









// Confirm static page is served
describe('initial page', function() {
  it('should exist', function() {
    return chai.request(app)
      .get('/', function(res) {
        expect(res).to.have.status(200);
    });
  });
});
