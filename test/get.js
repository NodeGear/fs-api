var request = require('supertest');
var http = require('http');
var should = require('should');
var config = require('../lib/config');

require('../bin/ng-fs');

request = request('http://127.0.0.1:'+config.port);

describe('get', function () {
	it('gets 404', function (done) {
		request
			.get('/nonexisting/file.txt')
			.set('Authorization', config.auth)
			.expect(404)
			.end(done);
	});
});
