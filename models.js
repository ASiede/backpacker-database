"use strict"

const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const commentSchema = mongoose.Schema({
  userContributed: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Trip'
  },
  content: 'string',
  dateAdded: 'string'
});

const tripSchema = mongoose.Schema({
  userContributed: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    "longAndLat": {
      type: String,
      required: true
      },
    "state": {
      type: String,
      required: true
      }
  },
  nights: {
    type: Number, 
    required: true
    },
  totalMileage: {
    type: Number, 
    required: true
    },
  shortDescription: 'string',
  longDescription: {
      type: String,
      required: true
      },
  difficulty: {
    type: String, 
    required: true
    },
  // features: ['string'],
  dateAdded: { type: Date },
  lastUpdated: { type: Date },
  comments: [commentSchema]
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  tripsPosted:[tripSchema]
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    tripsPosted: this.tripsPosted
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};





// const userSchema = mongoose.Schema({
//   username: 'string',
//   firstName: 'string',
//   lastName: 'string',
//   password: 'string',
//   tripsPosted:[tripSchema]
// });

//prehook for username
tripSchema.pre('find', function(next) {
	this.populate('userContributed');
	next();
});


tripSchema.methods.serialize = function() {
	return {
		id: this._id,
		name: this.name,
		userContributed: this.userContributed,
		location: this.location,
		nights: this.nights,
		totalMileage: this.totalMileage,
		shortDescription: this.shortDescription,
		longDescription: this.longDescription,
		difficulty: this.difficulty,
		// features: this.features,
    comments: this.comments,
    dateAdded: this.dateAdded,
    dateUpdated: this.dateUpdated
    
	};	
};

// userSchema.methods.serialize = function() {
// 	return {
// 		// id: this._id,
// 		username: this.username,
// 		firstName: this.firstName,
// 		lastName: this.lastName,
// 		// password: this.password,
// 		// tripsPosted: this.tripsPosted
// 	};	
// };

commentSchema.methods.serialize = function() {
  return {
    id: this._id,
    tripId: this.tripId,
    userContributed: this.userContributed.username,
    content: this.content,
    dateAdded: this.dateAdded
  }
};


const Trip = mongoose.model("Trip", tripSchema);
const User = mongoose.model("User", userSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Trip, User, Comment};