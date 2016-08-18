// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var fs = require('fs');
var http = require('http');
var archive = require('../helpers/archive-helpers.js');
var url = 'learn.shayhowe.com';
http.get('http://' + url, (res) => {
  // consume response body
  var page = '';
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    page += chunk;
  });
  res.on('end', function () {
    fs.writeFile(archive.paths.archivedSites + '/' + url + '.html', page, function (err) {
      if (err) {
        throw err;
      }
    });
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});

