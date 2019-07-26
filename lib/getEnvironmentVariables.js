const _ = require('lodash'),
  chalk = require('chalk'),

  environmentVariableRegex = /{{[a-zA-z0-9_\-\.\\\/\:\?\=\&]*}}/gm;

module.exports = {
  outputVariables ({ collection }) {
    console.info(chalk.yellow('Pumping out environment variables in the collection...'));
    
    if (_.isEmpty(collection)) {
      throw new Error('Cannot create an environment out of an empty collection');
    }

    let collectionJSON;

    try {
      collectionJSON = JSON.parse(collection);
    }
    catch (e) {
      throw new Error(e);
    }

    let result = this.removeDuplicates(_.compact(this.traverseObject(collectionJSON)));

    console.info(chalk.yellow('Environment variables pumped.'));

    return result;
  },

  traverseObject (collection) {
    let arr = [];

    if (_.isArray(collection)) {
      collection.forEach((value) => {
        arr = arr.concat(this.traverseObject(value));
      });
    }
    else if (_.isObject(collection)) {
      _.forIn(collection, (value) => {
        arr = arr.concat(this.traverseObject(value));
      });
    }
    else {
      arr = this.getVariableInString(collection);
    }

    return arr;
  },

  getVariableInString (input) {
    if (typeof input !== 'string') {
      return;
    }

    let regex = new RegExp(environmentVariableRegex);

    if (regex.test(input)) {
      return input.match(regex).map((value) => {
        return value.slice(2, value.length - 2);
      });
    }
  },

  removeDuplicates (input) {
    if (!_.isArray(input)) {
      throw new Error('Input to removeDuplicates must be an array');
    }

    return Array.from(new Set(input));
  }
};
