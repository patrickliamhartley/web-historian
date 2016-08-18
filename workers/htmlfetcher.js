// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
http.get('http://www.google.com/index.html', (res) => {
  // consume response body
  res.setEncoding('utf8');
  res.on('data', function (data) {
    console.log(data);
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});