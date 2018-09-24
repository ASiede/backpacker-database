// 'use strict';

// const mongoose = require('mongoose');
// const { Trip, Comment } = require('../models');


// mongoose.Promise = global.Promise;

// const userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   firstName: {type: String, default: ''},
//   lastName: {type: String, default: ''},
//   tripsPosted:[tripSchema]
// });

// UserSchema.methods.serialize = function() {
//   return {
//     username: this.username || '',
//     firstName: this.firstName || '',
//     lastName: this.lastName || '',
//     tripsPosted: this.tripsPosted
//   };
// };

// UserSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// UserSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

// const User = mongoose.model('User', UserSchema);

// module.exports = {User};