"use strict";

//?
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');

const bodyParser = require('body-parser');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { Trip, User, Comment } = require('./models');

const jsonParser = bodyParser.json();
const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


passport.use(localStrategy);
passport.use(jwtStrategy);




app.use('/users/', usersRouter);
app.use('/auth/', authRouter);



//include this as middleware for anything that you must be authorized as a user for
const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

//Get request to return posts
app.get("/trips", (req, res) => {
    
    //SEARCH PARAMETERS
    let searchparams = {};
    
    const queryparams = ["name", "location.state", "difficulty"];
    for (let i=0; i<queryparams.length; i++) {
      let param = queryparams[i];
      if (req.query[param]) {
        searchparams[param] = req.query[param];
      }
    };

    if (req.query.minNights && req.query.maxNights) {
      searchparams.nights = {
        $gte: req.query.minNights,
        $lte: req.query.maxNights
      }
    }

    if (req.query.minMileage && req.query.maxMileage) {
      searchparams.totalMileage = {
        $gte: req.query.minMileage,
        $lte: req.query.maxMileage
      }
    }

    if (req.query.description) {
      searchparams.longDescription = {"$regex": `${req.query.description}`, "$options": "i"} 
    }

    // const searchedFeatures = req.query.features;
    // console.log(searchedFeatures);
    // if (searchedFeatures) {
    //   searchparams.features = { $all: req.query.features }
    // }

    Trip.find(searchparams).limit(10)
    .populate('userContributed')
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

//Get trip by id
app.get('/trips/:id', (req, res) => {
    Trip.findById(req.params.id)
      .populate('userContributed')
    	.then(trip => res.json(trip.serialize()))
    	//Do I need to check that id and route is the same
    	.catch(err => {
      		console.error(err);
      		res.status(500).json({ message: 'Internal server error' });
    });
});

// Post trip
app.post('/trips', jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ['name', 'userContributed', 'location', 'nights', 'totalMileage', 'longDescription'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  User.findById(req.body.userContributed)
    .then( user => { 
      if (user) {
        console.log(user);
        Trip.create({
        	name: req.body.name,
        	userContributed: user,
        	location: req.body.location,
        	nights: req.body.nights,
        	totalMileage: req.body.totalMileage,
        	shortDescription: req.body.shortDescription,
        	longDescription: req.body.longDescription,
        	difficulty: req.body.difficulty,
        	// features: req.body.features,
        })
        .then(trip => res.status(201).json(trip.serialize()))
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        });
      } else {
          const message = `User not found`;
          console.error(message);
          return res.status(500).send(message);
        }    
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server errorrrrr' });
    });
});

//Put to update trip
app.put('/trips/:id', jsonParser, (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'location', 'nights', 'totalMileage', 'shortDescription', 'longDescription', 'difficulty'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Trip.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(trip => res.status(201).json(trip.serialize()))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//DELETE trip
app.delete('/trips/:id', (req, res) => {
  //check to make sure paths match??
  Trip
    .findByIdAndRemove(req.params.id)
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


//Post a comment
app.post('/comments', (req, res) => {
  const requiredFields = ['content', 'tripId', 'userContributed', 'dateAdded'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  User.findById(req.body.userContributed)
    .then( user => { 
      if (user) {
          // Comment.create({
          // content: req.body.content,
          // tripId: req.body.tripId,
          // userContributed: req.body.userContributed,
          // })
        Trip.findOne({
          _id: req.body.tripId
        })
        .then(trip => {
          
          trip.comments.push({
            content: `${req.body.content}`,
            tripId: `${req.body.tripId}`,
            userContributed: `${req.body.userContributed}`,
            dateAdded: `${req.body.dataAdded}`
          });
          // res.json(trip);
          trip.save();
          res.json(trip);
          res.status(201);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        });
      } else {
          const message = `User not found`;
          console.error(message);
          return res.status(500).send(message);
        }    
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//Put and update trip
app.put('/trips/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['name', 'location', 'nights', 'totalMileage', 'shortDescription', 'longDescription', 'difficulty'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Trip.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(trip => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// Get users
// app.get("/users", (req, res) => {
//     User.find()
//     .then(users => {
//     	res.json({
//     		users: users.map(user => user.serialize())
//     	})
//     }) 
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ message: "Internal server error" });
//     });
// });

// Post a new user

// app.post('/users', jsonParser, (req, res) => {
//   console.log(req.body);

//   const requiredFields = ['username','firstName', 'lastName', 'password'];
  
//   for (let i = 0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`;
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   User.create({
//     // check to make sure username isn't taken
//     username: req.body.username,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     // hashing password etc
//     password: req.body.password,
//   })
//   .then(user => res.status(201).json(user.serialize()))
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   });   
// });

// Get user by ID

// app.get('/users/:id', (req, res) => {
//     User.findById(req.params.id)
//       .then(user => res.json(user.serialize()))
//       //Do I need to check that id and route is the same
//       .catch(err => {
//           console.error(err);
//           res.status(500).json({ message: 'Internal server error' });
//     });
// });

// Delete Comment
app.delete('/comments/:id', (req, res) => {
  //check to make sure paths match??
  Comment
    .findByIdAndRemove(req.params.id)
    .then(comment => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl, { useNewUrlParser: true },
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