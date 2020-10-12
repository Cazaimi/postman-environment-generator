const async = require('async'),
  chalk = require('chalk'),
  
  readFile = require('./readFromFileAsync'),
  getEnvironmentValues = require('./getEnvironmentVariables'),
  composeNewEnvironment = require('./composeNewEnvironment'),
  createNewEnvironment = require('./createNewEnvironment');

module.exports = function ({ filePath, environmentName, apiKey, workspaceId }, options, callback) {
  console.log('apiKey:', apiKey);
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  let readApiKey = apiKey;
  
  async.waterfall([
    function (cb) {
      console.info(chalk.green.bold('Warming up...'));

      return readFile({ filePath }, cb);
    },
    function (collection, cb) {
      console.log('options:', options);
      let { readApiKeyFromFile } = options;

      if (!readApiKeyFromFile) {
        return cb(null, collection);
      }

      return readFile({ filePath: apiKey }, function (err, fetchedApiKey) {
        if (err) {
          console.error(chalk.red.bold('Error reading API key from file:', err));

          return cb(err);
        }

        console.log(fetchedApiKey);
        
        readApiKey = fetchedApiKey;

        return cb(null, collection);
      });
    },
    function (collection, cb) {
      let environmentValues = getEnvironmentValues.outputVariables({ collection }),
        environmentJsonBody = composeNewEnvironment(environmentName, environmentValues);

      return createNewEnvironment({ environmentJsonBody, apiKey: readApiKey, workspaceId }, cb);
    }
  ], function (err, results) {
    return callback(err, results);
  })
};
