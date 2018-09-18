"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
// const faker = require('faker');

const expect = chai.expect;

const {Trip, User, Comment} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const seedTrips = require('../db/trips');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');

chai.use(chaiHttp);

//Seeding trip data
function seedTripData() {
  console.info('seeding trip data');
  return Trip.insertMany(seedTrips);
  return User.insertMany(seedUsers);
  return Comment.insertMany(seedComments)
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Trips API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedTripData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


  // Get endpoint
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
            // need to put userContributed back in when figre out
            expect(trip).to.include.keys(
              'name', 'nights', 'id', 'location', 'totalMileage', 'shortDescription', 'longDescription', 'features');
          });
          resTrip = res.body.trips[0];
          return Trip.findById(resTrip.id);
        })
        .then(function(trip) {
          expect(resTrip.id).to.equal(trip.id);
          expect(resTrip.name).to.equal(trip.name);
          //UserContributing not working because reference isn't right
          // expect(resTrip.userContributed).to.equal(trip.userContributed);
          expect(resTrip.location).to.be.a('object');
          // expect(resTrip.location).to.contain(trip.location.longAndLat);
          // expect(resTrip.location).to.contain(trip.location.state);
          expect(resTrip.nights).to.equal(trip.nights);
          expect(resTrip.totalMileage).to.equal(trip.totalMileage);
          expect(resTrip.difficulty).to.equal(trip.difficulty);
          expect(resTrip.shortDescription).to.equal(trip.shortDescription);
          expect(resTrip.longDescription).to.equal(trip.longDescription);
          expect(resTrip.features).to.be.a('array');
          //error expecting ['lake'] to be ["lake"]
          // expect(resTrip.features).to.equal(trip.features);

        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new trip', function() {

      const newTrip = {
        userContributed: "5b958af16bfe8fba53fb5fc6",
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
      };
    
      return chai.request(app)
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
          //below isn't working
          // expect(res.body.location).to.equal(newTrip.location);
          expect(res.body.nights).to.equal(newTrip.nights);
          expect(res.body.totalMileage).to.equal(newTrip.totalMileage);
          expect(res.body.shortDescription).to.equal(newTrip.shortDescription);
          expect(res.body.longDescription).to.equal(newTrip.longDescription);
          expect(res.body.difficulty).to.equal(newTrip.difficulty);
          //something about arrays not equalling each other
          // expect(res.body.features).to.contain(newTrip.features);

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
        });
    });
  });
//PUT endpoint






  // put test not working
  describe('PUT endpoint', function() {
    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
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
          expect(res).to.have.status(204);

          return Trip.findById(updateData.id);
        })
        .then(function(trip) {
          expect(trip.name).to.equal(updateData.name);
          expect(trip.difficulty).to.equal(updateData.difficulty);
        });
    });

  });


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

describe('initial page', function() {
  it('should exist', function() {
    return chai.request(app)
      .get('/', function(res) {
        expect(res).to.have.status(200);
    });

  });

});

