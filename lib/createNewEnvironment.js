const chalk = require('chalk'),
  request = require('request');

module.exports = function ({ environmentJsonBody, apiKey, workspaceId }, callback) {
  console.log('Inside createNewEnvironment');
  let options = {
    method: 'POST',
    url: 'https://api.getpostman.com/environments',
    qs: {
      workspace: workspaceId
    },
    headers: {
      'X-Api-Key': encodeURIComponent(apiKey),
      'Content-Type': 'application/json'
    },
    body: environmentJsonBody,
    json: true
  };

  console.log('options:', options);

  console.info(chalk.yellow.bold('Creating environment...'));

  request(options, function (error, response, body) {
    console.log('error:', error);
    if (error) {
      return callback(new Error(`Error creating a environment ${environmentJsonBody.environment.name}:`, error));
    }

    if (response.statusCode >= 400) {
      return callback(new Error(`Postman API returned HTTP ${response.statusCode} with message:`, response.body));
    }

    console.info(chalk.green.bold(`Successfully created environment ${environmentJsonBody.environment.name}`));

    return callback(null, body);
  });

}