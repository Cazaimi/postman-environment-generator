const async = require('async'),
  chalk = require('chalk'),
  
  readFile = require('./readFromFileAsync'),
  getEnvironmentValues = require('./getEnvironmentVariables'),
  composeNewEnvironment = require('./composeNewEnvironment'),
  createNewEnvironment = require('./createNewEnvironment');

module.exports = function (filePath, environmentName, apiKey, workspaceId, callback) {
  async.waterfall([
    function (cb) {
      console.info(chalk.green.bold('Warming up...'));

      return readFile({ filePath }, cb);
    },
    function (collection, cb) {
      let environmentValues = getEnvironmentValues.outputVariables({ collection }),
        environmentJsonBody = composeNewEnvironment(environmentName, environmentValues);

      return createNewEnvironment({ environmentJsonBody, apiKey, workspaceId }, cb);
    }
  ], function (err, results) {
    return callback(err, results);
  })
};
