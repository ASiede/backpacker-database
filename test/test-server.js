"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const app = require('../server');

chai.use(chaiHttp);

describe('initial page', function() {
	it('should exist', function() {
		return chai.request(app)
			.get('/', function(res) {
				expect(res).to.have.status(200);
			});
	});

});
