var request = require('supertest');
var http = require('http');
var should = require('should');
var credentials = require('../lib/credentials');

require('../bin/fs-api');

request = request('http://127.0.0.1:'+credentials.port);

describe('post', function () {
	it('post file', function (done) {
		request
			.post('/a/b/c')
			.set('Authorization', credentials.auth)
			.attach('test.txt', 'test/fixtures/test.txt')
			.expect(201)
			.end(function(err, res) {
				should(err).be.null;
				done();
			});
	});

	it('gets back the file', function (done) {
		request
			.get('/a/b/c/test.txt')
			.set('Authorization', credentials.auth)
			.expect(200)
			.expect('hello there!')
			.end(done);
	});
});
