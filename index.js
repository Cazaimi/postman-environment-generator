#!/usr/bin/env node
const chalk = require('chalk'),

  orchestrator = require('./lib/orchestrator');

module.exports = function (callback) {
  // 1. Read collection file
  // 2. Get all environment variables from the collection JSON
  // 3. Compose Environment Body JSON
  // 4. Send request to Postman API
  // 5. Exit, giving status to the user

  let filePath = process.argv[2],
    environmentName = process.argv[3],
    apiKey = process.argv[4],
    workspaceId = process.argv[5];

  orchestrator(filePath, environmentName, apiKey, workspaceId, function (err, results) {
    if (err) {
      console.error('Error: ', err);

      return callback(err);
    }
    
    console.log(chalk.magenta('Created environment details', JSON.stringify(results)));

    return callback();
  })
}

!module.parent && module.exports(process.exit);
