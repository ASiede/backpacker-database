"use strict";

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Trip, User, Comment } = require('./models');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));



//Get request to return posts
app.get("/trips", (req, res) => {
    Trip.find()
    // .populate('user')
    .then(trips => {
    	res.json({
    		trips: trips.map(trip => trip.serialize())
    	})
    }) 
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//Get on by 
app.get('/trips/:id', (req, res) => {
  	Trip.findById(req.params.id)
    	.then(trip => res.json(trip.serialize()))
    	//Do I need to check that id and route is the same
    	.catch(err => {
      		console.error(err);
      		res.status(500).json({ message: 'Internal server error' });
    });
});

// Post trip
app.post('/trips', (req, res) => {

  const requiredFields = ['name', 'location', 'nights', 'totalMileage', 'longDescription'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Trip.create({
	name: req.body.name,
	userContributed: req.body.userName,
	location: req.body.location,
	nights: req.body.nights,
	totalMileage: req.body.totalMileage,
	shortDescription: req.body.shortDescription,
	longDescription: req.body.longDescription,
	difficulty: req.body.difficulty,
	features: req.body.features
    })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Get users
app.get("/users", (req, res) => {
    User.find()
    // .populate('userContributed')
    .then(users => {
    	res.json({
    		users: users.map(user => user.serialize())
    	})
    }) 
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer}