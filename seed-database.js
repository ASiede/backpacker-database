
'use strict';

const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

const {User, Trip, Comment} = require('/models');

const seedTrips = require('/db/trips');
const seedUsers = require('/db/users');
const seedComments = require('/db/comments');

console.log(`Connecting to mongodb at ${TEST_DATABASE_URL}`);
mongoose.connect(TEST_DATABASE_URL)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Trip.insertMany(seedTrips),
      Trip.createIndexes(),

      User.insertMany(seedUsers),
      User.createIndexes(),

      Comment.insertMany(seedComments),
      User.createIndexes(),
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });