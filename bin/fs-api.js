var http = require('http'),
	fs = require('fs'),
	formidable = require('formidable'),
	path = require('path'),
	credentials = require('../lib/credentials'),
	spawn = require('child_process').spawn,
	async = require('async');

http.createServer(function (req, res) {
	if (!req.headers['authorization'] || req.headers['authorization'] != credentials.auth) {
		res.writeHead(401);
		res.end();

		return;
	}

	var filePath = path.join(credentials.files, path.normalize(req.url));
	var method = req.method.toLowerCase();

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
}).listen(credentials.port);
