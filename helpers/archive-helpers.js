var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, 'utf8', function (err, content) {
    if (err) {
      throw err;
    } else {
      var urls = content.split('\n');
      cb(urls);
    }
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function (urls) {
    cb(urls.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url, cb) {
  cb = cb || function () {};
  fs.appendFile(exports.paths.list, url + '\n', function (err) {
    if (err) {
      throw err;
    } else {
      cb();
    }
  });
};

exports.isUrlArchived = function(fileName, cb) {
  // passes a boolean to the callback function
  // indicating if the file exists
  fs.exists(exports.paths.archivedSites + '/' + fileName, cb);
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (exists === false) {
        request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url + '.html'))
            .on('error', function (err) { console.log(err); });
      }
    });
  });
};
