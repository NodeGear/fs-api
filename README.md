
Filesystem API
==============

Filesystem API server

Requires `Authorization: <token>` header for every request.

Supported Methods:

- `GET /my-file.txt` - Get contents of my-file.txt
- `POST /my-file.txt` - Create my-file.txt with request body
- `PUT /my-file.txt` - Update my-file.txt with request body
- `DELETE /my-file.txt` - Delete my-file.txt

Provides metrics for requests to a statsd server. Configurable via environment variables.

See `lib/config.js` for specifics.

Tests
-----

`npm test`

Todo
----

- Synchronise files across filesystem nodes..
- Provide timing metrics to statsd
