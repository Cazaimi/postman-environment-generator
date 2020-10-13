#!/usr/bin/env node
const chalk = require('chalk'),
  { program } = require('commander'),

  orchestrator = require('./lib/orchestrator');

module.exports = function (callback) {
  // 1. Read collection file
  // 2. Get all environment variables from the collection JSON
  // 3. Compose Environment Body JSON
  // 4. Send request to Postman API
  // 5. Exit, giving status to the user

  program
    .option('--collection <filePath>', 'File path to the collection out of which environment variables should be picked up.')
    .option('--environment <environmentName>', 'The name that the environment should get')
    .option('--apiKey <apiKey>', 'Postman API key/Or if you\'re concerned about security, then the path to the api key file')
    .option('--workspaceId <workspaceId>', 'The workspace into which this environment should be loaded')
    .option('--apiKeyFile', 'Whether to use a file of STDIN for the api key')
    .parse(process.argv);

  const {
    collection: filePath,
    environment: environmentName,
    apiKey,
    workspaceId,
    apiKeyFile: readApiKeyFromFile
  } = program;

  orchestrator({ filePath, environmentName, apiKey, workspaceId }, { readApiKeyFromFile }, function (err, results) {
    if (err) {
      console.error('Error: ', err);

      return callback(err);
    }
    
    console.log(chalk.magenta('Created environment details', JSON.stringify(results)));

    return callback();
  })
}

!module.parent && module.exports(process.exit);
