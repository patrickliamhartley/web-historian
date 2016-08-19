var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');

// require more modules/folders here!

var routes = {
  '/': archive.paths.siteAssets + '/index.html',
  '/styles.css': archive.paths.siteAssets + '/styles.css',
  '/jquery.min.js': archive.paths.siteAssets + '/jquery.min.js',
  '/loading.html': archive.paths.siteAssets + '/loading.html'
};

var actions = {
  'GET': function (req, res) {
    var route = routes[req.url];
    if (route) {
      helpers.serveAssets(res, route); 
    } else if (fs.existsSync(archive.paths.archivedSites + req.url + '.html')) {
      console.log('page was found!');
      helpers.serveAssets(res, archive.paths.archivedSites + req.url + '.html');
    } else {
      res.writeHead(404, exports.headers);
      res.end('Not Found');
    }
  },
  'POST': function (req, res) {
    req.setEncoding('utf8');
    req.on('data', (json) => {
      var url = json.slice(4);
      archive.isUrlArchived(url + '.html', function (exists) {
        if (exists) {
          res.writeHead(302, {Location: '/' + url});
          res.end();
        } else {
          archive.isUrlInList(url, function (exists) {
            if (!exists) {
              archive.addUrlToList(url);
            }
          });
          res.writeHead(302, {Location: '/loading.html'});
          res.end();
        }
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
};
