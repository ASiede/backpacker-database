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
  name: 'string',
  location: {
    "longAndLat": 'string',
    "state": 'string'
  },
  nights: 'string',
  totalMileage: 'string',
  shortDescription: 'string',
  longDescription:'string',
  difficulty: 'string',
  features: ['string'],
  dateAdded: 'string',
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
  // console.log(user);
  // console.log(this.userContributed.username);
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
		features: this.features,
    comments: this.comments,
    dateAdded: this.dateAdded
    
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