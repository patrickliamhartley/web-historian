var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');

// require more modules/folders here!

var routes = {
  '/': archive.paths.siteAssets + '/index.html',
  '/styles.css': archive.paths.siteAssets + '/styles.css',
  '/jquery.min.js': archive.paths.siteAssets + '/jquery.min.js',
};

var actions = {
  'GET': function (req, res) {
    var route = routes[req.url];
    if (route) {
      helpers.serveAssets(res, route); 
    } else if (req.url.startsWith('/www.')) {
      if (fs.existsSync(archive.paths.archivedSites + req.url)) {
        helpers.serveAssets(res, archive.paths.archivedSites + req.url);
      }
    } else {
      res.writeHead(404, exports.headers);
      res.end('Not Found');
    }
  },
  'POST': function (req, res) {
    res.writeHead(302, exports.headers);
    req.on('data', (json) => {
      fs.appendFile(archive.paths.list, json.slice(4) + '\n', (err)=>{
        if (err) { throw err; } 
        res.end();
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  console.log(`request method: ${req.method} with url ${req.url}`);
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    res.writeHead(405, exports.headers);
    res.end('Method Not Allowed');
  }
  // res.end(archive.paths.siteAssets + '/index.html');
};
