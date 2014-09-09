var request = require('supertest');
var http = require('http');
var should = require('should');
var credentials = require('../lib/credentials');

require('../bin/fs-api');

request = request('http://127.0.0.1:'+credentials.port);

describe('get', function () {
	it('gets 404', function (done) {
		request
			.get('/nonexisting/file.txt')
			.set('Authorization', credentials.auth)
			.expect(404)
			.end(done);
	});
});
