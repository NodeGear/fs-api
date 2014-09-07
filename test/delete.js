var request = require('supertest');
var http = require('http');
var should = require('should');
var config = require('../lib/config');

require('../bin/fs-api');

request = request('http://127.0.0.1:'+config.port);

describe('delete', function () {
	it('post file', function (done) {
		request
			.post('/a/b/c')
			.set('Authorization', config.auth)
			.attach('todelete.txt', 'test/fixtures/test.txt')
			.expect(201)
			.end(function(err, res) {
				should(err).be.null;
				done();
			});
	});

	it('deletes the file', function (done) {
		request
			.delete('/a/b/c/todelete.txt')
			.set('Authorization', config.auth)
			.expect(201)
			.end(done);
	});

	it('gets 404', function (done) {
		request
			.get('/a/b/c/todelete.txt')
			.set('Authorization', config.auth)
			.expect(404)
			.end(done)
	})
});
