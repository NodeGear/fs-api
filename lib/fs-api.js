var http = require('http'),
	fs = require('fs'),
	formidable = require('formidable'),
	path = require('path'),
	spawn = require('child_process').spawn,
	async = require('async'),
	config = require('./config');

http.createServer(function (req, res) {
	if (!req.headers['authorization'] || req.headers['authorization'] != config.credentials.auth) {
		config.metrics.increment('fs_api.requests.failed.'+req.headers['authorization']);
		
		res.writeHead(401);
		res.end();

		return;
	}

	var filePath = path.join(config.credentials.files, path.normalize(req.url));
	var method = req.method.toLowerCase();

	// todo config.metrics.timing (would need hooks on response end.)
	config.metrics.increment('fs_api.requests.'+method);

	if (method == 'head') {
		res.writeHead(501);
		res.end();

		return;
	}

	if (method == 'post' || method == 'put') {
		var mkdirp = spawn('mkdir', ['-p', filePath]);
		mkdirp.on('close', function () {
			var form = new formidable.IncomingForm();
			form.uploadDir = filePath;
			form.keepExtensions = true;

			form.parse(req, function(err, fields, files) {
				var fsArr = [];
				for (var f in files) {
					files[f].postName = f;
					fsArr.push(files[f]);
				}

				async.each(fsArr, function (file, cb) {
					fs.rename(file.path, path.join(filePath, file.postName), cb);
				}, function (e) {
					if (e) throw e;

					res.writeHead(201);
					res.end();
				});
			});
		});

		return;
	}

	if (method == 'delete') {
		fs.unlink(filePath, function (e) {
			if (e) {
				res.writeHead(404);
			} else {
				res.writeHead(201);
			}

			res.end();
		});

		return;
	}

	if (method == 'get') {
		var stream = fs.createReadStream(filePath);
		stream.on('error', function (e) {
			res.writeHead(404);
			res.end();
		});

		stream.pipe(res);
		return;
	}
}).listen(config.credentials.port);

console.log('HTTP server listening to', config.credentials.port);
