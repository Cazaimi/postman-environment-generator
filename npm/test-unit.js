const chalk = require('chalk'),
  recursive = require('recursive-readdir'),
  Mocha = require('mocha'),

  UNIT_TEST_DIR = `${__dirname}/../tests/unit`;

module.exports = function load (exit) {  
  console.log(chalk.yellow.bold('Running unit tests with mocha =>'));

  let mocha = new Mocha({
    diff: true,
    fullTrace: true,
    timeout: 60 * 1000
  });

  recursive(UNIT_TEST_DIR, function (err, files) {
    if (err) { return (err); }
    
    files.forEach((file) => {
      if (file.includes('.test.js')) {
        mocha.addFile(file);
      }
    });

    mocha.run((failures) => {
      exit(failures ? 1 : 0);
    })
  });
}

!module.parent && module.exports(process.exit);