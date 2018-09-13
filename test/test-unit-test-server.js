"use strict";

// const chai = require('chai');
const mongoose = require('mongoose');

const expect = require('chai').expect;
// const expect = chai.expect;


const {app} = require('../server');

describe('app', function() {
  describe('get endpoint', function() {
    it('should return trips', function() {
      return app.get('/trips')
      .then((res) => {
        expect(res).status(200);
      })
      
    })
  })
})



