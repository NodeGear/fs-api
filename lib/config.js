exports.credentials = {
	port: process.env.PORT || 8000,
	files: process.env.FILES_DIR || "../files",
	auth: process.env.AUTH || "ng-fs",
	statsd_ip: process.env.STATSD_IP || "",
	statsd_port: process.env.STATSD_PORT || 8125
}

exports.metrics = new (require('lynx'))(exports.credentials.statsd_ip, exports.credentials.statsd_port);
