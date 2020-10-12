const async = require('async'),
  chalk = require('chalk'),
  
  readCollection = require('./readCollection'),
  getEnvironmentValues = require('./getEnvironmentVariables'),
  composeNewEnvironment = require('./composeNewEnvironment'),
  createNewEnvironment = require('./createNewEnvironment');

module.exports = function (filePath, environmentName, apiKey, workspaceId, callback) {
  async.waterfall([
    function (cb) {
      console.info(chalk.green.bold('Warming up...'));

      return readCollection({ filePath, apiKey }, cb);
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
