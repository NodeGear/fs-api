var request = require('supertest');
var http = require('http');
var should = require('should');
var config = require('../lib/config');

require('../bin/fs-api');

request = request('http://127.0.0.1:'+config.credentials.port);

describe('get', function () {
	it('gets 404', function (done) {
		request
			.get('/nonexisting/file.txt')
			.set('Authorization', config.credentials.auth)
			.expect(404)
			.end(done);
	});
});
