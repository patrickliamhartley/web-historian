var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  if (asset.endsWith('.html') || asset.endsWith('.com')) {
    exports.headers['Content-Type'] = 'text/html';
  } else if (asset.endsWith('.css')) {
    exports.headers['Content-Type'] = 'text/css';
  } else if (asset.endsWith('.js')) {
    exports.headers['Content-Type'] = 'text/javascript';
  }
  console.log(exports.headers['Content-Type']);
  fs.readFile(asset, 'utf8', (err, data)=>{
    if (err) {
      res.writeHead(404, exports.headers);
      res.end('Not Found');
    } else {
      res.writeHead(200, exports.headers);
      res.write(data);
      res.end();
    } 
  });

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!
