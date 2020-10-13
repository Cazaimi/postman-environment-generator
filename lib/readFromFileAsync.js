/**
 * This is a wrapper around Node.JS' async read file function.
 */

const fs = require('fs'),
  request = require('request');

module.exports = function ({ filePath , apiKey}, callback) {
  let options = {
    method: 'GET',
    url: 'https://api.getpostman.com/collections/' + filePath,
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    },
    json: true
  };


  //Check if filePath is a Collection uuid (8-4-4-4-12 RFC 4122)
  const uid = filePath.split('-');
  if( ( uid.length == 6 && (  uid[1].length == 8 ||  uid[2].length == 4 || uid[3].length == 4 || uid[4].length == 4 ||  uid[5].length == 12 )) 
      || ( uid.length == 5 && (  uid[0].length == 8 ||  uid[1].length == 4 || uid[2].length == 4 || uid[3].length == 4 ||  uid[4].length == 12 ))){

    request(options, function (error, response, body) {
      if (error) {
        return cb(new Error(`Error getting a collection:`, error));
      }
  
      if (response.statusCode >= 400) {
        return cb(new Error(`Postman API returned HTTP ${response.statusCode} with message:`, response.body));
      }
  
      return callback(null, JSON.stringify(body));
    });
  
  }
  //else read file
  else {
    fs.readFile(filePath, 'utf8', function (err, fileContents) {
      if (err) { return callback(err); }
      
      return callback(null, fileContents);
    });
  }
};
